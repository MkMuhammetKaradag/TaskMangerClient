import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import RoleBasedRoute from './RoleBasedRoute';
import TasksPage from '../../pages/App/TasksPage';
import ProjectsPage from '../../pages/App/ProjectsPage';
import ProjectPage from '../../pages/App/ProjectPage';
import AppLayout from './AppLayout';

const AppNavigator = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/tasks"
          element={
            <RoleBasedRoute
              element={<TasksPage />}
              allowedRoles={['WORKER', 'ADMIN']}
            />
          }
        />
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
    </AppLayout>
  );
};

export default AppNavigator;
