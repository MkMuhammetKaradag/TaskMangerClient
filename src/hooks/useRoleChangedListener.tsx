import { gql, useSubscription, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { changeUserRole } from '../redux/slices/AuthSlice';
import { User } from '../types/redux';
import { GET_ME } from '../graphql/queries';

const ROLE_CHANGED_SUBSCRIPTION = gql`
  subscription ChangeUserRole {
    changeUserRole {
      _id
      roles
    }
  }
`;

const useRoleChangedListener = () => {
  const { data: subscriptionData, error } = useSubscription(
    ROLE_CHANGED_SUBSCRIPTION
  );
  const [getMe, { data: userData, error: userError }] = useLazyQuery(GET_ME);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (subscriptionData?.changeUserRole) {
      // const newRoles = subscriptionData.changeUserRole.roles as UserRole[];

      // Eğer rol değişikliği varsa `GET_ME` sorgusunu tetikleyin
      getMe();

      // dispatch(changeUserRole(newRoles));
    }

    if (error) {
      console.error('Subscription error:', error);
    }
  }, [subscriptionData, error, getMe, dispatch]);

  useEffect(() => {
    if (userData?.getMe) {
      dispatch(changeUserRole((userData.getMe as User).roles));
    }

    if (userError) {
      console.error('Error fetching user data:', userError);
    }
  }, [userData, userError, dispatch]);
};

export default useRoleChangedListener;
