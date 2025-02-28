import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle, Clock, AlertCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, onStatusChange, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');

  const priorityColors = {
    low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  };

  const statusIcons = {
    todo: Clock,
    'in-progress': AlertCircle,
    completed: CheckCircle,
  };

  const StatusIcon = statusIcons[task.status];

  const handleSave = () => {
    onUpdate(task.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority as Task['priority'],
      dueDate: editedDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority);
    setEditedDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${
        task.status === 'completed' 
          ? 'border-green-500' 
          : task.status === 'in-progress' 
            ? 'border-yellow-500' 
            : 'border-blue-500'
      }`}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
          />
          
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
            rows={3}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Priority:</label>
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Due Date:</label>
              <input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-1 rounded"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>

          {task.dueDate && (
            <div className="mb-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Due: </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${
                task.status === 'completed' 
                  ? 'text-green-500' 
                  : task.status === 'in-progress' 
                    ? 'text-yellow-500' 
                    : 'text-blue-500'
              }`} />
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(task.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}