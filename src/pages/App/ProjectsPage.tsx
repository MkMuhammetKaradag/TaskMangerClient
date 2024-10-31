import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS_BY_COMPANY } from '../../graphql/queries';
import { Project, ProjectStatus } from '../../types/graphql';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../../components/App/Projects/ProjectCard';

interface ProjectsQueryResult {
  getAllProjectsByCompany: Project[];
}

const ProjectsPage: React.FC = () => {
  const { data, loading, error } = useQuery<ProjectsQueryResult>(
    GET_ALL_PROJECTS_BY_COMPANY,
    {
      fetchPolicy: 'cache-first',
    }
  );
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  const openTasks = (id: string) => {
    navigate(`/project/${id}/tasks`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.getAllProjectsByCompany.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={openTasks}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
