import React, { useEffect } from 'react';
import { TaskForm } from '../components/TaskForm';
import { TaskCard } from '../components/TaskCard';
import { Header } from '../components/Header';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

export function TasksPage() {
  const { tasks, addTask, updateTaskStatus, deleteTask, updateTask } = useTasks();
  const { status } = useParams<{ status?: string }>();
  const navigate = useNavigate();

  // Validate status parameter
  useEffect(() => {
    if (status && !['todo', 'in-progress', 'completed'].includes(status)) {
      navigate('/tasks', { replace: true });
    }
  }, [status, navigate]);

  const filteredTasks = status 
    ? tasks.filter(task => task.status === status)
    : tasks;

  const tasksByStatus = {
    todo: status ? (status === 'todo' ? filteredTasks : []) : tasks.filter(task => task.status === 'todo'),
    'in-progress': status ? (status === 'in-progress' ? filteredTasks : []) : tasks.filter(task => task.status === 'in-progress'),
    completed: status ? (status === 'completed' ? filteredTasks : []) : tasks.filter(task => task.status === 'completed'),
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <TaskForm onSubmit={addTask} />
        </div>

        {status ? (
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
              {status.replace('-', ' ')} Tasks
            </h2>
            <button
              onClick={() => navigate('/tasks')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Tasks
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in-progress', 'completed'] as const).map(statusKey => (
            <div key={statusKey} className={`space-y-4 ${status && status !== statusKey ? 'hidden md:block' : ''}`}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize flex items-center">
                {statusKey.replace('-', ' ')} 
                <span className="ml-2 px-2 py-0.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  {tasksByStatus[statusKey].length}
                </span>
              </h2>
              <AnimatePresence>
                {tasksByStatus[statusKey].map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={updateTaskStatus}
                    onDelete={deleteTask}
                    onUpdate={updateTask}
                  />
                ))}
              </AnimatePresence>
              
              {tasksByStatus[statusKey].length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-2 border-dashed border-gray-300 dark:border-gray-700"
                >
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No tasks in this column
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}