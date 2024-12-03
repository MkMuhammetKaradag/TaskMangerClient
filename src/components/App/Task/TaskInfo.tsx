import  { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TaskDetail } from '../../../types/graphql';

import { formatDate } from '../../../utils/formatDate';
import { BiCalendar, BiUser } from 'react-icons/bi';


interface TaskInfoProps {
  taskData: TaskDetail;
}

const TaskInfo: FC<TaskInfoProps> = ({ taskData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mt-6 space-y-6">
      {/* Assignment & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
          <BiUser className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Assignee</p>
            <p className="text-gray-900">
              {`${taskData.assignee.firstName} ${taskData.assignee.lastName}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
          <BiCalendar className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="text-gray-900">{formatDate(taskData.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-600">{taskData.description}</p>
      </div>

      {/* Parent Tasks */}
      {taskData.parentTask && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Parent Tasks</h2>
          <div className="space-y-2">
            <div
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() =>
                navigate(`/task/${taskData.parentTask?._id}`, {
                  state: {
                    backgroundLocation: location.state.backgroundLocation,
                  },
                })
              }
            >
              <span className="text-gray-800">{taskData.parentTask.title}</span>
            </div>
          </div>
        </div>
      )}
      {/* Sub Tasks */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Sub Tasks</h2>
        <div className="space-y-2">
          {taskData.subTasks.map((subTask) => (
            <div
              key={subTask._id}
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() =>
                navigate(`/task/${subTask._id}`, {
                  state: {
                    backgroundLocation: location.state.backgroundLocation,
                  },
                })
              }
            >
              <span className="text-gray-800">{subTask.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Created By */}
      <div className="pt-4 mt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Created by {taskData.createdByUser.firstName}{' '}
          {taskData.createdByUser.lastName}
        </p>
      </div>
    </div>
  );
};

export default TaskInfo;
