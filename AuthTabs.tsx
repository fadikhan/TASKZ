import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex rounded-md shadow-sm">
      <motion.button
        type="button"
        data-tab="login"
        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-l-md ${
          activeTab === 'login'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onClick={() => onTabChange('login')}
        whileTap={{ scale: 0.98 }}
      >
        <LogIn className="w-5 h-5 mr-2" />
        Login
      </motion.button>
      <motion.button
        type="button"
        data-tab="register"
        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-r-md ${
          activeTab === 'register'
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onClick={() => onTabChange('register')}
        whileTap={{ scale: 0.98 }}
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Register
      </motion.button>
    </div>
  );
}