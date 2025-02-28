import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TaskTrackerProps {
  completedToday: number;
  totalToday: number;
  lastCompletedTask?: {
    title: string;
    completedAt: Date;
  };
}

export function TaskTracker({ completedToday, totalToday, lastCompletedTask }: TaskTrackerProps) {
  const [timeSpent, setTimeSpent] = useState<string>('0:00:00');
  
  // Update time spent every second
  useEffect(() => {
    const startTime = localStorage.getItem('task-session-start');
    if (!startTime) {
      localStorage.setItem('task-session-start', Date.now().toString());
    }
    
    const updateTimer = () => {
      const start = parseInt(localStorage.getItem('task-session-start') || Date.now().toString());
      const now = Date.now();
      const diff = now - start;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeSpent(
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Session Time</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{timeSpent}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Time spent this session</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Completed Tasks</h3>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedToday} / {totalToday}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tasks completed today</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Today's progress</p>
        </div>
      </div>
      
      {lastCompletedTask && (
        <div className="mt-4 p-3 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last completed: <span className="font-medium text-gray-900 dark:text-white">{lastCompletedTask.title}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
              {format(new Date(lastCompletedTask.completedAt), 'h:mm a')}
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );
}