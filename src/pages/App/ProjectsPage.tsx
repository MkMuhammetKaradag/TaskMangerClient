// import { useQuery } from '@apollo/client';
// import { GET_ALL_PROJECTS_BY_COMPANY } from '../../graphql/queries';
// import { Project } from '../../types/graphql';

// const ProjectsPage = () => {
//   const { data, loading } = useQuery(GET_ALL_PROJECTS_BY_COMPANY);

//   if (!data) {
//     return <div>null data...</div>;
//   }
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   const projects = data.getAllProjectsByCompany as Project[];
//   return (
//     <div>
//       {projects.map((item) => {
//         return <div key={item._id}>{item.name}</div>;
//       })}
//     </div>
//   );
// };

// export default ProjectsPage;

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS_BY_COMPANY } from '../../graphql/queries';
import { Project } from '../../types/graphql';
import { useNavigate } from 'react-router-dom';

// Query sonucu için tip tanımı
interface ProjectsQueryResult {
  getAllProjectsByCompany: Project[];
}

const ProjectsPage: React.FC = () => {
  const { data, loading, error } = useQuery<ProjectsQueryResult>(
    GET_ALL_PROJECTS_BY_COMPANY
  );
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  const openTasks = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {data.getAllProjectsByCompany.map((project) => (
          <li
            onClick={() => openTasks(project._id)}
            key={project._id}
            className="cursor-pointer"
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;
