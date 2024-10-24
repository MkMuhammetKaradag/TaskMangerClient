import { Handle, Position } from '@xyflow/react';
import { Task } from '../../../types/graphql';
import {
  getTaskPriorityColor,
  getTaskStatusColor,
  getTaskStatusText,
} from '../../../utils/status';
import { useLocation, useNavigate } from 'react-router-dom';

export const CustomTaskNode: React.FC<{
  data: { title: string; task: Task };
}> = ({ data: { task, title } }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      className="border w-56 border-gray-500 shadow-md p-5 rounded-md cursor-move"
      style={{
        backgroundColor: getTaskPriorityColor(task.priority),
      }}
    >
      <h3
        onClick={() =>
          navigate(`/task/${task._id}`, {
            state: {
              backgroundLocation: location,
            },
          })
        }
        className=" cursor-pointer m-0 mb-2"
      >
        {task.title}
      </h3>
      <p
        className="m-1 p-1 inline-block rounded"
        style={{
          backgroundColor: getTaskStatusColor(task.status),
        }}
      >
        Status: {getTaskStatusText(task.status)}
      </p>
      <p className="m-1">Priority: {task.priority}</p>
      <p className="m-1">Due: {new Date(+task.dueDate).toLocaleDateString()}</p>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
