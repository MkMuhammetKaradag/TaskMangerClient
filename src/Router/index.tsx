// Router.tsx
import React from 'react';
import AppNavigator from './navigations/AppNavigator';
import AuthNavigator from './navigations/AuthNavigator';
import { useAppSelector } from '../redux/hooks';

const Router = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Kullanıcı yükleniyor mu kontrolü
  if (isLoading) {
    return <div>router loading!!!!</div>;
  }

  return <>{isAuthenticated && user ? <AppNavigator /> : <AuthNavigator />}</>;
};

export default Router;
