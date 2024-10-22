import React from 'react';

import { FiAlertCircle, FiClock } from 'react-icons/fi';
interface SubTask {
  _id: string;
  title: string;
}

interface ParentTask {
  _id: string;
  title: string;
}

interface Task {
  _id: string;
  title: string;
  parentTask: ParentTask | null;
  subTasks: SubTask[];
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'REVIEW';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  description: string;
}
interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCard = ({ task, isDragging = false }: TaskCardProps) => {
  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`
          bg-white p-4 rounded-lg
          ${isDragging ? 'shadow-2xl scale-105' : 'shadow hover:shadow-md'}
          transition-all duration-200
          cursor-grab active:cursor-grabbing
        `}
    >
      <h3 className="font-medium mb-2">{task.title}</h3>

      <div className="text-sm text-gray-500 mb-2">{task.description}</div>

      <div className="flex items-center gap-2 mb-2">
        <FiClock className="w-4 h-4" />
        <span className="text-sm">
          {new Date(parseInt(task.dueDate)).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${priorityColors[task.priority]}
          `}
        >
          {task.priority}
        </span>

        {task.subTasks.length > 0 && (
          <div className="flex items-center gap-1 text-gray-500">
            <FiAlertCircle className="w-4 h-4" />
            <span className="text-sm">{task.subTasks.length} alt görev</span>
          </div>
        )}
      </div>
    </div>
  );
};
