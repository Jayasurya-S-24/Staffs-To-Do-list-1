import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { TaskEditForm } from './TaskEditForm';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const { toggleTask, deleteTask } = useTasks();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysUntilDue = () => {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0 && !task.completed;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && !task.completed;

  const getStatusColor = () => {
    if (task.completed) return 'text-green-600 bg-green-50 border-green-200';
    if (isOverdue) return 'text-red-600 bg-red-50 border-red-200';
    if (isDueSoon) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getStatusText = () => {
    if (task.completed) return 'Completed';
    if (isOverdue) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return 'Due Today';
    if (daysUntilDue === 1) return 'Due Tomorrow';
    if (isDueSoon) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
        task.priority === 'important' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'
      } ${task.completed ? 'opacity-75' : ''}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {task.priority === 'important' && (
                <div className="bg-red-100 rounded-full p-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
              )}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.priority === 'important' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {task.priority === 'important' ? 'Important' : 'Normal'}
              </span>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => setShowEditForm(true)}
                className="text-gray-400 hover:text-blue-600 transition duration-200 p-1 rounded"
                title="Edit task"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-600 transition duration-200 p-1 rounded"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <h3 className={`font-semibold text-lg mb-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          
          <p className={`text-sm mb-4 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            
            <div className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition duration-200 ${
                task.completed
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {task.completed ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>

      {showEditForm && (
        <TaskEditForm 
          task={task} 
          onClose={() => setShowEditForm(false)} 
        />
      )}
    </>
  );
}