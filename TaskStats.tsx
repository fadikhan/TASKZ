import React from 'react';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskStatsProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  // Chart data
  const statusChartData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
        borderColor: ['#2563EB', '#D97706', '#059669'],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#374151' : '#fff',
        titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: TrendingUp,
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      link: '/tasks'
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Clock,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      link: '/tasks/todo'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: AlertCircle,
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      link: '/tasks/in-progress'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
      link: '/tasks/completed'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link 
                to={stat.link}
                className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color} mr-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Task Status</h3>
          <div className="h-64">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Completion Rate</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke={document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'} 
                  strokeWidth="10"
                />
                
                {/* Progress circle */}
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="10" 
                  strokeDasharray={`${stats.completionRate * 2.83} 283`}
                  strokeDashoffset="0"
                  initial={{ strokeDasharray: "0 283" }}
                  animate={{ strokeDasharray: `${stats.completionRate * 2.83} 283` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
                
                {/* Text in the middle */}
                <text 
                  x="50" 
                  y="50" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="18"
                  fontWeight="bold"
                  fill={document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1e40af'}
                >
                  {stats.completionRate}%
                </text>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}