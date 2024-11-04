import { FC, useState } from 'react';
import { BiCalendar, BiFolder, BiUser } from 'react-icons/bi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TaskDetail } from '../../types/graphql';
import { getTaskPriorityColor, getTaskStatusColor } from '../../utils/status';
import { useQuery } from '@apollo/client';
import { GET_TASK } from '../../graphql/queries';
import CloseButton from '../../components/App/Common/CloseButton';
import { formatDate } from '../../utils/formatDate';
import { useAppSelector } from '../../redux/hooks';
import TaskInfo from '../../components/App/Task/TaskInfo';
import TaskHeader from '../../components/App/Task/TaskHeader';
import TabBar from '../../components/App/ProjectDetail/TabBar';
import { UserRole } from '../../types/redux';
import TaskUpdateForm from '../../components/App/Task/TaskUpdateForm';

// Main Task Page component
interface GetTaskQueryResult {
  getTask: TaskDetail;
}

interface GetTaskOperationVariables {
  taskId?: string;
}
const TaskPage: FC = () => {
  const { taskId } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const [activeTab, setActiveTab] = useState('INFO');
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

  const tabs = [
    { label: 'INFO', value: 'INFO' },
    {
      label: 'UPDATE',
      value: 'UPDATE',
      visible: user?.roles.some((role) =>
        [UserRole.ADMIN, UserRole.EXECUTIVE].includes(role)
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'INFO':
        return <TaskInfo taskData={taskData}></TaskInfo>;
      case 'UPDATE':
        return <TaskUpdateForm taskData={taskData}></TaskUpdateForm>;

      default:
        return null;
    }
  };
  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={handleClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full mx-4 h-[80vh] rounded-2xl bg-white overflow-hidden flex flex-col"
      >
        {/* Header Section */}
        <div className="flex-grow overflow-y-auto p-6">
          <TaskHeader
            priority={taskData.priority}
            status={taskData.status}
            title={taskData.title}
            name={taskData.project.name}
          ></TaskHeader>
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
