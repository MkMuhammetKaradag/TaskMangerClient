import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import RoleBasedRoute from './RoleBasedRoute';
import TasksPage from '../../pages/App/TasksPage';
import ProjectsPage from '../../pages/App/ProjectsPage';
import ProjectPage from '../../pages/App/ProjectPage';
import AppLayout from './AppLayout';
import ProjectDetailPage from '../../pages/App/ProjectDetailPage';
import TaskPage from '../../pages/App/TaskPage';
import { UserRole } from '../../types/redux';

const AppNavigator = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  return (
    <AppLayout>
      <>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tasks"
            element={
              <RoleBasedRoute
                element={<TasksPage />}
                allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}
              />
            }
          />
          <Route
            path="/project/:projectId/tasks"
            element={
              <RoleBasedRoute
                element={<ProjectPage />}
                allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}
              />
            }
          />

          <Route
            path="/projects"
            element={
              <RoleBasedRoute
                element={<ProjectsPage />}
                allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}
              />
            }
          />
          <Route path="/unauthorized" element={<div>Yetkisiz Erişim</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {state?.backgroundLocation && (
          <Routes>
            <Route
              path="/p/:projectId/:segment"
              element={
                <RoleBasedRoute
                  element={<ProjectDetailPage />}
                  allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}
                />
              }
            />
            <Route
              path="/task/:taskId"
              element={
                <RoleBasedRoute
                  element={<TaskPage />}
                  allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}
                />
              }
            />
          </Routes>
        )}
      </>
    </AppLayout>
  );
};

export default AppNavigator;
