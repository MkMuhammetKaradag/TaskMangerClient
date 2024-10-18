import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Auth/Logout';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/AuthSlice';

const HomePage = () => {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  useEffect(() => {
    console.log('hello');
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
