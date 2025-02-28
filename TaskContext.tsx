import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: TaskFormData) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'task-management-tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load tasks from localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          // Filter tasks for the current user
          const userTasks = parsedTasks.filter((task: Task) => task.userId === user.id);
          setTasks(userTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks from localStorage', error);
        toast.error('Failed to load your tasks');
      }
    } else {
      setTasks([]);
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      try {
        // Get all tasks from localStorage
        const savedTasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
        const allTasks = savedTasksJson ? JSON.parse(savedTasksJson) : [];
        
        // Filter out current user's tasks
        const otherUsersTasks = allTasks.filter((task: Task) => task.userId !== user.id);
        
        // Save both current user's tasks and other users' tasks
        localStorage.setItem(
          TASKS_STORAGE_KEY, 
          JSON.stringify([...otherUsersTasks, ...tasks])
        );
      } catch (error) {
        console.error('Failed to save tasks to localStorage', error);
        toast.error('Failed to save your tasks');
      }
    }
  }, [tasks, user]);

  const addTask = (taskData: TaskFormData) => {
    if (!user) return;
    
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      userId: user.id,
      dueDate: taskData.dueDate,
      tags: taskData.tags || [],
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast.success('Task added successfully');
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, status } : task
      )
    );
    toast.info(`Task status updated to ${status.replace('-', ' ')}`);
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
    toast.success('Task updated successfully');
  };

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100) 
      : 0
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        updateTask,
        taskStats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};