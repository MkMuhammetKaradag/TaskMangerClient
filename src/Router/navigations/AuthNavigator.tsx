import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from '../../pages/Auth/AuthPage';

const AuthNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AuthNavigator;
