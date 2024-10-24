import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_WITH_DETAILS } from '../../graphql/queries';
import CloseButton from '../../components/App/Common/CloseButton';
import TabBar from '../../components/App/ProjectDetail/TabBar';
import { ProjectDetail } from '../../types/graphql';
import TaskSummary from '../../components/App/ProjectDetail/TaskSummary';
import Team from '../../components/App/ProjectDetail/Team';
import ProjectSummary from '../../components/App/ProjectDetail/ProjectSummary';

ChartJS.register(ArcElement, Tooltip, Legend);

const ModalHeader: FC = () => (
  <div className="flex justify-center p-2 items-center mb-4">
    <h2 className="text-xl font-bold">Project</h2>
  </div>
);

interface ProjectWithDetailsQueryResult {
  getProjectWithDetails: ProjectDetail;
}

interface ProjectWithDetailsOperationVariables {
  projectId?: string;
}

const ProjectDetailPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, segment } = useParams<{
    projectId: string;
    segment: string;
  }>();
  const [activeTab, setActiveTab] = useState(segment || 'project');
  const [projectDetails, setProjectDetails] = useState<ProjectDetail | null>(
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
          <ProjectSummary
            endDate={projectDetails.endDate}
            name={projectDetails.name}
            projectManager={projectDetails.projectManager}
            startDate={projectDetails.startDate}
            status={projectDetails.status}
            description={projectDetails.description}
          ></ProjectSummary>
        );
      case 'team':
        return (
          <Team tasks={projectDetails.tasks} team={projectDetails.team}></Team>
        );
      case 'taskSummary':
        return (
          <TaskSummary taskSummary={projectDetails.taskSummary}></TaskSummary>
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
