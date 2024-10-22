import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTaskCard } from './SortableTaskCard';
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
interface TaskColumnProps {
  status: Task['status'];
  tasks: Task[];
}

export const TaskColumn = ({ status, tasks }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
       
          bg-gray-100 p-4 rounded-lg  w-80 overflow-x-hidden max-h-[90vh] overflow-y-auto 
          transition-colors duration-200
          ${isOver ? 'bg-gray-200 ring-2 ring-blue-400 ring-inset' : ''}
        `}
    >
      <h2 className="text-lg z-40 fixed font-semibold">{status}</h2>
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex mt-5 flex-col">
          {tasks.map((task) => (
            <SortableTaskCard key={task._id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              Görev sürükleyip bırakın
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
