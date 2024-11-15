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
import CreateProjectPage from '../../pages/App/CreateProjectPage';
import CreateTaskPage from '../../pages/App/CreateTaskPage';
import DirectPage from '../../pages/App/DirectPage';
import ChatPage from '../../pages/App/ChatPage';
import { useStatusUpdater } from '../../hooks/useStatusUpdater';
import { useAutoLogout } from '../../hooks/useAutoLogout';

import CreateChatPage from '../../pages/App/CreateChatPage';
import CompanyPage from '../../pages/App/CompanyPage';
import CompanyJoinRequestsPage from '../../pages/App/CompanyJoinRequestsPage';
import CompanyEmployees from '../../components/App/Company/CompanyEmployees';
import useRoleChangedListener from '../../hooks/useRoleChangedListener';
import CreateCompany from '../../pages/App/CreateCompany';
import ManageCompanyRequestsPage from '../../pages/App/ManageCompanyRequestsPage';

const AppNavigator = () => {
  const location = useLocation();
  useStatusUpdater();
  useAutoLogout();
  useRoleChangedListener();
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
            path="/company/:companyId?"
            element={
              <RoleBasedRoute
                element={<CompanyPage />}
                allowedRoles={[
                  UserRole.ADMIN,
                  UserRole.EXECUTIVE,
                  UserRole.WORKER,
                  UserRole.USER,
                ]}
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

          <Route
            path="/direct"
            element={
              <RoleBasedRoute
                element={<DirectPage />}
                allowedRoles={[UserRole.USER]}
              />
            }
          >
            <Route
              index
              element={
                <div className="w-2/3 flex items-center justify-center text-2xl text-gray-500">
                  Bir sohbet seçin
                </div>
              }
            />
            <Route
              path="t/:chatId"
              element={
                <RoleBasedRoute
                  element={<ChatPage />}
                  allowedRoles={[UserRole.USER, UserRole.ADMIN]}
                />
              }
            />
          </Route>

          <Route path="/unauthorized" element={<div>Yetkisiz Erişim</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {state?.backgroundLocation && (
          <Routes>
            <Route
              path="/create-chat"
              element={
                <RoleBasedRoute
                  element={<CreateChatPage />}
                  allowedRoles={[UserRole.EXECUTIVE, UserRole.ADMIN]}
                />
              }
            />
            <Route
              path="/create-project"
              element={
                <RoleBasedRoute
                  element={<CreateProjectPage />}
                  allowedRoles={[UserRole.EXECUTIVE, UserRole.ADMIN]}
                />
              }
            />
            <Route
              path="/create-task"
              element={
                <RoleBasedRoute
                  element={<CreateTaskPage />}
                  allowedRoles={[UserRole.EXECUTIVE, UserRole.ADMIN]}
                />
              }
            />
            <Route
              path="/create-company"
              element={
                <RoleBasedRoute
                  element={<CreateCompany />}
                  allowedRoles={[
                    UserRole.USER,
                    UserRole.EXECUTIVE,
                    UserRole.ADMIN,
                  ]}
                />
              }
            />
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

            <Route
              path="/company/join-requests/:companyId?"
              element={
                <RoleBasedRoute
                  element={<CompanyJoinRequestsPage />}
                  allowedRoles={[UserRole.EXECUTIVE, UserRole.ADMIN]}
                />
              }
            />

            <Route
              path="/company/employees/:companyId?"
              element={
                <RoleBasedRoute
                  element={<CompanyEmployees />}
                  allowedRoles={[UserRole.EXECUTIVE, UserRole.ADMIN]}
                />
              }
            />
            <Route
              path="/company-request"
              element={
                <RoleBasedRoute
                  element={<ManageCompanyRequestsPage />}
                  allowedRoles={[UserRole.ADMIN]}
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
