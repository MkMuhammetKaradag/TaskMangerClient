import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import RoleBasedRoute from './RoleBasedRoute';
import TasksPage from '../../pages/App/TasksPage';
import ProjectsPage from '../../pages/App/ProjectsPage';
import ProjectPage from '../../pages/App/ProjectPage';

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/project/:projectId"
        element={
          <RoleBasedRoute
            element={<ProjectPage />}
            allowedRoles={['WORKER', 'ADMIN']}
          />
        }
      />

      <Route
        path="/projects"
        element={
          <RoleBasedRoute
            element={<ProjectsPage />}
            allowedRoles={['WORKER', 'ADMIN']}
          />
        }
      />
      <Route path="/unauthorized" element={<div>Yetkisiz Erişim</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppNavigator;
