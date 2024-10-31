import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGOUT_USER } from '../graphql/mutations';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/AuthSlice';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 dakika

export const useAutoLogout = () => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();
  const [logoutUser] = useMutation(LOGOUT_USER); // useMutation'u burada tanımlayın
  const dispatch = useAppDispatch();

  const resetTimer = () => {
    setLastActivity(Date.now());
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate('/login'); // Oturum kapatıldıktan sonra giriş sayfasına yönlendirme
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    const intervalId = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        handleLogout();
      }
    }, 60000);

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
      clearInterval(intervalId);
    };
  }, [lastActivity, handleLogout]);

  return resetTimer;
};
