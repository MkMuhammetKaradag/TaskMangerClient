import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Logout';
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

  return (
    <div>
      HomePage
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
        onClick={() => {
          handleLogout();
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default HomePage;
