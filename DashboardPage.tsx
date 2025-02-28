import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { TaskStats } from '../components/TaskStats';
import { TaskTracker } from '../components/TaskTracker';
import { useTasks } from '../context/TaskContext';
import { motion } from 'framer-motion';
import { format, isToday } from 'date-fns';
import { CheckCircle, Clock, Calendar } from 'lucide-react';

export function DashboardPage() {
  const { tasks, taskStats } = useTasks();
  const [lastCompletedTask, setLastCompletedTask] = useState<{ title: string; completedAt: Date } | undefined>(undefined);
  
  // Tasks due today
  const todayTasks = tasks.filter(task => 
    task.dueDate && isToday(new Date(task.dueDate))
  );
  
  // Tasks completed today
  const completedToday = tasks.filter(task => 
    task.status === 'completed' && isToday(new Date(task.createdAt))
  ).length;
  
  // Find the most recently completed task
  useEffect(() => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    if (completedTasks.length > 0) {
      // Sort by creation date (most recent first)
      const sortedTasks = [...completedTasks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setLastCompletedTask({
        title: sortedTasks[0].title,
        completedAt: new Date(sortedTasks[0].createdAt)
      });
    }
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your tasks and productivity</p>
        </motion.div>
        
        {/* Task Tracker */}
        <div className="mb-8">
          <TaskTracker 
            completedToday={completedToday}
            totalToday={todayTasks.length}
            lastCompletedTask={lastCompletedTask}
          />
        </div>
        
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Tasks</h2>
          
          {todayTasks.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {todayTasks.map(task => (
                  <li key={task.id} className="py-4 flex items-start">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                    ) : (
                      <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        task.status === 'completed' 
                          ? 'line-through text-gray-500 dark:text-gray-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {task.description}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No tasks scheduled for today</p>
            </div>
          )}
        </motion.div>
        
        {/* Task Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Statistics</h2>
          <TaskStats stats={taskStats} />
        </motion.div>
      </main>
    </div>
  );
}