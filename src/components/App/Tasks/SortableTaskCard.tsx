import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
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
interface SortableTaskCardProps {
  task: Task;
}

export const SortableTaskCard = ({ task }: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({
    id: task._id,
    data: {
      task,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        mt-2
          relative
          ${isDragging ? 'opacity-50' : 'opacity-100'}
          ${over ? 'my-1' : 'my-0'}
          transition-spacing duration-200
        `}
      {...attributes}
      {...listeners}
    >
      {over?.id == task._id && (
        <div className="absolute w-full h-1 bg-red-400 rounded" />
      )}
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
};
