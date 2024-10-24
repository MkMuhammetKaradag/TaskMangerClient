import { FC } from 'react';
import { BiCalendar, BiFolder, BiUser } from 'react-icons/bi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TaskDetail } from '../../types/graphql';
import { getTaskPriorityColor, getTaskStatusColor } from '../../utils/status';
import { useQuery } from '@apollo/client';
import { GET_TASK } from '../../graphql/queries';
import CloseButton from '../../components/App/Common/CloseButton';
import { formatDate } from '../../utils/formatDate';

// Main Task Page component
interface GetTaskQueryResult {
  getTask: TaskDetail;
}

interface GetTaskOperationVariables {
  taskId?: string;
}
const TaskPage: FC = () => {
  const { taskId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<
    GetTaskQueryResult,
    GetTaskOperationVariables
  >(GET_TASK, {
    variables: { taskId: taskId },
    fetchPolicy: 'no-cache',
  });

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>task is null</div>;
  const taskData = data.getTask;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <CloseButton onClick={handleClose} />
      <div className="max-w-4xl w-full mx-4 h-[80vh] rounded-2xl bg-white overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto p-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {taskData.title}
              </h1>
              <div className="flex gap-2">
                <span
                  style={{
                    backgroundColor: getTaskStatusColor(taskData.status),
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {taskData.status}
                </span>

                <span
                  style={{
                    backgroundColor: getTaskPriorityColor(taskData.priority),
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {taskData.priority}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="flex items-center text-gray-600">
              <BiFolder className="mr-2 h-5 w-5" />
              <span>{taskData.project.name}</span>
            </div>
          </div>

          {/* Main Content */}
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
                  <p className="text-gray-900">
                    {formatDate(taskData.dueDate)}
                  </p>
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
                <h2 className="font-semibold text-gray-900 mb-3">
                  Parent Tasks
                </h2>
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
                    <span className="text-gray-800">
                      {taskData.parentTask.title}
                    </span>
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
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
