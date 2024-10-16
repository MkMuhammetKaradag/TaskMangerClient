import React, { useMemo, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useQuery } from '@apollo/client';
import AuthReducer from './slices/AuthSlice';
import { GET_ME } from '../graphql/queries';

const Loading = () => (
  <div className="h-screen w-full bg-black text-white flex items-center justify-center">
    Loading...
  </div>
);

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  const { data, loading } = useQuery(GET_ME);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [loading]);

  const store = useMemo(() => {
    return configureStore({
      reducer: {
        auth: AuthReducer,
      },
      preloadedState: {
        auth: {
          user: data?.getMe || null,
          isAuthenticated: !!data?.getMe,
          isLoading: loading,
        },
      },
    });
  }, [data, loading]);

  if (loading || showLoading) {
    return <Loading />;
  }

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
