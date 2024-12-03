import  { FC } from 'react';
import {
  getTaskPriorityColor,
  getTaskStatusColor,
} from '../../../utils/status';
import { TaskPriority, TaskStatus } from '../../../types/graphql';
import { BiFolder } from 'react-icons/bi';
interface TaskHeaderProps {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  name: string;
}
const TaskHeader: FC<TaskHeaderProps> = ({ title, status, priority, name }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex gap-2">
          <span
            style={{
              backgroundColor: getTaskStatusColor(status),
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium`}
          >
            {status}
          </span>

          <span
            style={{
              backgroundColor: getTaskPriorityColor(priority),
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium`}
          >
            {priority}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex items-center text-gray-600">
        <BiFolder className="mr-2 h-5 w-5" />
        <span>{name}</span>
      </div>
    </div>
  );
};

export default TaskHeader;
