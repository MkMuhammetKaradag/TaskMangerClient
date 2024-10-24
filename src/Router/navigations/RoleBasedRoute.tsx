import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { User, UserRole } from '../../types/redux';
interface RoleBasedRouteProps {
  element: React.ReactElement;
  allowedRoles: UserRole[];
}
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const user = useAppSelector((state) => state.auth.user);

  const hasRequiredRole = (
    user: User | null,
    allowedRoles: UserRole[]
  ): boolean => {
    return user?.roles.some((role) => allowedRoles.includes(role)) || false;
  };

  if (hasRequiredRole(user, allowedRoles)) {
    return element;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleBasedRoute;
