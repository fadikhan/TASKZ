import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { toast } from 'react-toastify';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USERS_STORAGE_KEY = 'task-management-users';
const CURRENT_USER_KEY = 'task-management-current-user';

// Helper functions for user management
const getUsers = (): Array<User & { password: string }> => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to get users from localStorage', error);
    return [];
  }
};

const saveUsers = (users: Array<User & { password: string }>) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage', error);
  }
};

const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get current user from localStorage', error);
    return null;
  }
};

const saveCurrentUser = (user: User) => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save current user to localStorage', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing user session on mount
  useEffect(() => {
    const user = getCurrentUser();
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false,
        });
        saveCurrentUser(userWithoutPassword);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = getUsers();
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        return false;
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
      };
      
      // Save to storage
      saveUsers([...users, newUser]);
      
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const updateProfile = async (updates: { name?: string; email?: string }): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === authState.user?.id);
      
      if (userIndex === -1) return false;
      
      // Update user data
      if (updates.name) users[userIndex].name = updates.name;
      if (updates.email) users[userIndex].email = updates.email;
      
      // Save updated users
      saveUsers(users);
      
      // Update current user
      const updatedUser = {
        ...authState.user,
        ...updates,
      };
      
      setAuthState({
        ...authState,
        user: updatedUser,
      });
      
      saveCurrentUser(updatedUser);
      
      return true;
    } catch (error) {
      console.error('Profile update failed', error);
      return false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!authState.user) return false;
      
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === authState.user?.id);
      
      if (userIndex === -1) return false;
      
      // Verify current password
      if (users[userIndex].password !== currentPassword) {
        return false;
      }
      
      // Update password
      users[userIndex].password = newPassword;
      saveUsers(users);
      
      return true;
    } catch (error) {
      console.error('Password update failed', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};