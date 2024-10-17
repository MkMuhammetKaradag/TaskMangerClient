import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/App/HomePage';
import RoleBasedRoute from './RoleBasedRoute';
import TasksPage from '../../pages/App/TasksPage';

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/task"
        element={
          <RoleBasedRoute
            element={<TasksPage />}
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
