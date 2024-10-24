import React, { FC } from 'react';
import { BaseUser, ProjectStatus } from '../../../types/graphql';
interface ProjectSummaryProps {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  projectManager: BaseUser;
}
const ProjectSummary: FC<ProjectSummaryProps> = ({
  name,
  endDate,
  projectManager,
  startDate,
  status,
  description,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <p className="mb-2">
        <span className="font-semibold">Status:</span> {status}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Start Date:</span>{' '}
        {new Date(parseInt(startDate)).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <span className="font-semibold">End Date:</span>{' '}
        {new Date(parseInt(endDate)).toLocaleDateString()}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Description:</span>{' '}
        {description}
      </p>
      <h3 className="text-xl font-semibold mb-2">Project Manager</h3>
      <p>
        {projectManager.firstName}{' '}
        {projectManager.lastName}
      </p>
    </div>
  );
};

export default ProjectSummary;
