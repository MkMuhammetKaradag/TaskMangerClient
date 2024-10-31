import React from 'react';
import { Project, ProjectStatus } from '../../../types/graphql';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, onClick }) => {
    const getStatusClasses = (status: ProjectStatus) => {
      switch (status) {
        case ProjectStatus.ACTIVE:
          return 'bg-green-100 border-green-500 shadow-green-200';
        case ProjectStatus.COMPLETED:
          return 'bg-blue-100 border-blue-500 shadow-blue-200';
        case ProjectStatus.ENDED:
          return 'bg-yellow-100 border-yellow-500 shadow-yellow-200';
        case ProjectStatus.CANCELLED:
          return 'bg-red-100 border-red-500 shadow-red-200';
        default:
          return 'bg-gray-100 border-gray-500 shadow-gray-200';
      }
    };

    return (
      <div
        onClick={() => onClick(project._id)}
        className={`p-6 border-l-4 rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition duration-300 ease-in-out ${getStatusClasses(
          project.status
        )}`}
      >
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-700 text-sm mb-4">
          {project.description || 'No description provided'}
        </p>
        <div className="text-gray-600 text-xs">
          <p>
            <span className="font-semibold">Start Date:</span>{' '}
            {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">End Date:</span>{' '}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Status:</span> {project.status}
          </p>
        </div>
      </div>
    );
  }
);

export default ProjectCard;
