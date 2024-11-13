import { gql, useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { changeUserRole } from '../redux/slices/AuthSlice';
import { UserRole } from '../types/redux';

const ROLE_CHANGED_SUBSCRIPTION = gql`
  subscription ChangeUserRole {
    changeUserRole {
      _id
      roles
    }
  }
`;

const useRoleChangedListener = () => {
  const { data, error } = useSubscription(ROLE_CHANGED_SUBSCRIPTION);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data?.changeUserRole) {
      const newRoles = data.changeUserRole.roles as UserRole[];

      // Kullanıcı rolü güncellenmişse, gerekli yönlendirmeleri yap
      if (!newRoles.includes(UserRole.USER)) {
        // window.location.reload();
        dispatch(changeUserRole(newRoles));
      } else {
        // Kullanıcının yeni rolüne göre sayfayı yenileyin veya oturumu güncelleyin
        // window.location.reload();
      }
    }

    if (error) {
      console.error('Subscription error:', error);
    }
  }, [data, error, history]);
};

export default useRoleChangedListener;
