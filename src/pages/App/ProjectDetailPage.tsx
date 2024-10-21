import React, { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_WITH_DETAILS } from '../../graphql/queries';

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
  tasks: Array<{
    _id: string;
    title: string;
    description: string;
    status: string;
    assignee: {
      _id: string;
      firstName: string;
      lastName: string;
      profilePhoto: string | null;
    };
  }>;
}

interface ProjectWithDetailsQueryResult {
  getProjectWithDetails: ProjectDetails;
}

interface ProjectWithDetailsOperationVariables {
  projectId?: string;
}

const calculateUserTaskStats = (userId: string, tasks: any[]) => {
  const userTasks = tasks.filter((task) => task.assignee._id === userId);
  const stats = {
    total: userTasks.length,
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
  };

  userTasks.forEach((task) => {
    switch (task.status) {
      case 'TODO':
        stats.todo++;
        break;
      case 'IN_PROGRESS':
        stats.in_progress++;
        break;
      case 'REVIEW':
        stats.review++;
        break;
      case 'DONE':
        stats.done++;
        break;
    }
  });

  return stats;
};

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

  const { data, loading, error } = useQuery<
    ProjectWithDetailsQueryResult,
    ProjectWithDetailsOperationVariables
  >(GET_PROJECT_WITH_DETAILS, {
    variables: { projectId },
  });

  useEffect(() => {
    if (data) {
      setProjectDetails(data?.getProjectWithDetails);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            <h2 className="text-2xl font-bold mb-4">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectDetails.team.map((member) => {
                const stats = calculateUserTaskStats(
                  member._id,
                  projectDetails.tasks
                );
                return (
                  <div
                    key={member._id}
                    className="bg-white shadow rounded-lg p-4"
                  >
                    <div className="flex items-center mb-4">
                      {member.profilePhoto ? (
                        <img
                          src={member.profilePhoto}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-600">
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{`${member.firstName} ${member.lastName}`}</h3>
                        <p className="text-sm text-gray-600">
                          Total Tasks: {stats.total}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Task Distribution</h4>
                      <Pie
                        data={{
                          labels: ['Todo', 'In Progress', 'Review', 'Done'],
                          datasets: [
                            {
                              data: [
                                stats.todo,
                                stats.in_progress,
                                stats.review,
                                stats.done,
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
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                boxWidth: 12,
                                font: {
                                  size: 10,
                                },
                              },
                            },
                            title: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
