import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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
import UserProfileSettingPage from '../../pages/App/UserProfileSettingPage';
import ProfileEditPage from '../../components/App/UserProfileSetting/UserProfileEdit';
import UserPage from '../../pages/App/UserPage';
import MyCompanyMembershipRequest from '../../components/App/ProfileSetting/MyCompanyMembershipRequest';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useSubscription } from '@apollo/client';
import { VIDEO_CALL_STARTED } from '../../graphql/subscriptions';
import VideoCallPage from '../../pages/App/VideoCallPage';

interface VideoCallStartedNotification {
  userName: string;
  chatId: string;
}

const IncomingCallListener = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { data } = useSubscription(VIDEO_CALL_STARTED, {
    variables: {
      userId: user?._id,
    },
  });

  const navigate = useNavigate();
  const location = useLocation(); // Mevcut konumu al
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (data?.videoCallStarted) {
      const { userName, chatId } =
        data.videoCallStarted as VideoCallStartedNotification;

      const toastId = toast.info(
        <div className="p-2 ">
          <div>Incoming call from {userName}</div>
          <div>
            <button
              className="bg-green-400 p-3 hover:bg-green-500"
              onClick={() => handleAcceptCall(chatId)}
            >
              Accept
            </button>
            <button
              className="bg-red-400 p-3 hover:bg-red-500"
              onClick={() => handleRejectCall()}
            >
              Reject
            </button>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        }
      );

      timerRef.current = setTimeout(() => {
        handleRejectCall();
        toast.dismiss(toastId);
      }, 10000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data]);

  const handleAcceptCall = (chatId: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Ses çalmayı durdur

    navigate(`/call/${chatId}`, {
      state: { backgroundLocation: location }, // Mevcut konumu backgroundLocation olarak gönder
    });
    toast.dismiss();
    // Örneğin: history.push(`/chat/${chatId}`);
  };

  const handleRejectCall = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    toast.dismiss();
  };

  return null; // Bu bileşen herhangi bir UI render etmez
};

const AppNavigator = () => {
  const location = useLocation();
  useStatusUpdater();
  useAutoLogout();
  useRoleChangedListener();
  const state = location.state as { backgroundLocation?: Location };
  return (
    <AppLayout>
      <>
        <IncomingCallListener />
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
          <Route
            path="/user/:userId?"
            element={
              <UserPage />
              // <RoleBasedRoute
              //   element={<UserPage />}
              //   allowedRoles={[
              //     UserRole.ADMIN,
              //     UserRole.EXECUTIVE,
              //     UserRole.WORKER,
              //     UserRole.USER,
              //   ]}
              // />
            }
          />
          <Route
            path="/profile-setting"
            element={
              <RoleBasedRoute
                element={<UserProfileSettingPage />}
                allowedRoles={[UserRole.USER]}
              />
            }
          >
            <Route
              // path="/"
              index
              element={
                <RoleBasedRoute
                  element={<ProfileEditPage></ProfileEditPage>}
                  allowedRoles={[UserRole.USER, UserRole.ADMIN]}
                />
              }
            />
            <Route
              path=":profileIdId"
              element={
                <RoleBasedRoute
                  element={<ChatPage />}
                  allowedRoles={[UserRole.USER, UserRole.ADMIN]}
                />
              }
            />
            {/* <Route
              path="company-membership-request"
              element={
                <RoleBasedRoute
                  element={<MyCompanyMembershipRequest />}
                  allowedRoles={[UserRole.USER, UserRole.ADMIN]}
                />
              }
            /> */}
          </Route>

          <Route path="/unauthorized" element={<div>Yetkisiz Erişim</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {state?.backgroundLocation && (
          <Routes>
            <Route
              path="/call/:chatId"
              element={<VideoCallPage></VideoCallPage>}
            />
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
              path="/profile-setting/company-membership-request"
              element={
                <RoleBasedRoute
                  element={<MyCompanyMembershipRequest />}
                  allowedRoles={[UserRole.USER, UserRole.ADMIN]}
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
