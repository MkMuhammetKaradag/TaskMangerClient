import { useEffect, useState } from 'react';

import AppNavigator from './navigations/AppNavigator';
import AuthNavigator from './navigations/AuthNavigator';
import { useAppSelector } from '../redux/hooks';

const Router = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector((s) => s.auth);

  return (
    <>
      {!isLoading && (
        <>
          {isAuthenticated && user ? (
            <AppNavigator></AppNavigator>
          ) : (
            <AuthNavigator></AuthNavigator>
          )}
        </>
      )}
    </>
  );
};

export default Router;
