import React, { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
interface TabProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 flex-1 py-2 ${
      isActive ? 'border-b-2 border-gray-500' : ''
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const TabBar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { label: 'Project', value: 'project' },
    { label: 'Team', value: 'team' },
    { label: 'TaskSummary', value: 'taskSummary' },
  ];

  return (
    <div className="flex justify-center space-x-3 border-b border-gray-300 py-2">
      <div className="flex w-full justify-between border-gray-700 mb-4">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            isActive={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
          />
        ))}
      </div>
    </div>
  );
};

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="absolute top-0 right-0 z-50 justify-end ">
    <button
      onClick={onClick}
      className=" bg-black rounded-full text-gray-100 xl:bg-transparent xl:text-white text-3xl"
    >
      <AiOutlineClose />
    </button>
  </div>
);

const ModalHeader: React.FC = () => (
  <div className="flex justify-center p-2 items-center mb-4">
    <h2 className="text-xl font-bold">Project</h2>
  </div>
);

interface ProjectDetails {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  projectManager: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
  };
  team: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
  }>;
  taskSummary: {
    totalTasks: number;
    todoTasks: number;
    in_progressTasks: number;
    reviewTasks: number;
    doneTasks: number;
  };
}
const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, segment } = useParams<{
    projectId: string;
    segment: string;
  }>();
  const [activeTab, setActiveTab] = useState(segment || 'project');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );

  useEffect(() => {
    // Burada GraphQL sorgunuzu yapacaksınız
    // Örnek olarak, veriyi doğrudan state'e atıyoruz
    setProjectDetails({
      _id: '670e4c24fa104cd56299cc0e',
      name: 'task Frontend',
      startDate: '1729026000000',
      endDate: '1729371600000',
      status: 'ACTIVE',
      description: 'task projesi için frontend tasarımı',
      projectManager: {
        _id: '6707b9fc1b66fd4f88469e6d',
        firstName: 'asas',
        lastName: 'asasa',
        profilePhoto: null,
      },
      team: [
        {
          _id: '6707b9fc1b66fd4f88469e6d',
          firstName: 'asas',
          lastName: 'asasa',
          profilePhoto: null,
        },
        {
          _id: '670d10b0f9830ab3c96b1d8a',
          firstName: 'yifa',
          lastName: 'fare',
          profilePhoto: null,
        },
      ],
      taskSummary: {
        totalTasks: 17,
        todoTasks: 15,
        in_progressTasks: 1,
        reviewTasks: 1,
        doneTasks: 0,
      },
    });
  }, []);

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };

  const renderContent = () => {
    if (!projectDetails) return <div>Loading...</div>;

    switch (activeTab) {
      case 'project':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{projectDetails.name}</h2>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              {projectDetails.status}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Start Date:</span>{' '}
              {new Date(
                parseInt(projectDetails.startDate)
              ).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">End Date:</span>{' '}
              {new Date(parseInt(projectDetails.endDate)).toLocaleDateString()}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Description:</span>{' '}
              {projectDetails.description}
            </p>
            <h3 className="text-xl font-semibold mb-2">Project Manager</h3>
            <p>
              {projectDetails.projectManager.firstName}{' '}
              {projectDetails.projectManager.lastName}
            </p>
          </div>
        );
      case 'team':
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Project Manager</h3>
            <p>
              {projectDetails.projectManager.firstName}{' '}
              {projectDetails.projectManager.lastName}
            </p>
            <h2 className="text-2xl font-bold mb-4">Team Members</h2>
            <ul>
              {projectDetails.team.map((member) => (
                <li key={member._id} className="mb-2">
                  {member.firstName} {member.lastName}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'taskSummary':
        const taskData = {
          labels: ['Todo', 'In Progress', 'Review', 'Done'],
          datasets: [
            {
              data: [
                projectDetails.taskSummary.todoTasks,
                projectDetails.taskSummary.in_progressTasks,
                projectDetails.taskSummary.reviewTasks,
                projectDetails.taskSummary.doneTasks,
              ],
              backgroundColor: [
                'rgba(255, 206, 86, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(75, 192, 192, 0.7)',
              ],
              borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };

        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Task Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-4 rounded">
                    <p className="font-semibold">Total Tasks</p>
                    <p className="text-2xl">
                      {projectDetails.taskSummary.totalTasks}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded">
                    <p className="font-semibold">Todo Tasks</p>
                    <p className="text-2xl">
                      {projectDetails.taskSummary.todoTasks}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded">
                    <p className="font-semibold">In Progress</p>
                    <p className="text-2xl">
                      {projectDetails.taskSummary.in_progressTasks}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded">
                    <p className="font-semibold">Review</p>
                    <p className="text-2xl">
                      {projectDetails.taskSummary.reviewTasks}
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded">
                    <p className="font-semibold">Done</p>
                    <p className="text-2xl">
                      {projectDetails.taskSummary.doneTasks}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Task Distribution
                </h3>
                <Pie
                  data={taskData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      title: {
                        display: true,
                        text: 'Task Status Distribution',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <CloseButton onClick={handleClose} />
      <div className="max-w-4xl w-full mx-auto h-[80vh] rounded-2xl bg-white overflow-hidden flex flex-col">
        <ModalHeader />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-grow overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
