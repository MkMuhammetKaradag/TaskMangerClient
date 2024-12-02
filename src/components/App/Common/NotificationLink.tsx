import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client'; // GraphQL mutation için gerekli
import { MARK_NOTIFICATION_AS_READ } from '../../../graphql/mutations';
import { NotificationType } from '../../../utils/Notification/types';
import { GET_NOTIFICATIONS } from '../../../graphql/queries';

// Bildirim için interface
interface Notification {
  _id: string;
  isRead: boolean;
  type: NotificationType;
  sender: { userName: string };
  message: string;
  content: { _id: string };
}

// Mutation için input tipi
interface MarkNotificationAsReadInput {
  notificationId: string;
}

// Mutation için response tipi
interface MarkNotificationAsReadResponse {
  markNotificationAsRead: Notification;
}

const NotificationLink: React.FC<{
  notification: Notification;
  isGrouped?: boolean;
  markGroupAsRead?: (groupId: string) => void;
}> = ({ notification, isGrouped, markGroupAsRead }) => {
  const location = useLocation();

  // GraphQL mutation hook'u
  const [markNotificationAsRead] = useMutation<
    MarkNotificationAsReadResponse,
    MarkNotificationAsReadInput
  >(MARK_NOTIFICATION_AS_READ, {
    refetchQueries(result) {
      return [
        {
          query: GET_NOTIFICATIONS,
        },
      ];
    },
  });

  //   // Rota belirleme fonksiyonu
  const getNotificationRoute = () => {
    const routeMap: Record<NotificationType, string> = {
      [NotificationType.TASK]: `/task/${notification.content._id}`,
      [NotificationType.PROJECT]: `/project/${notification.content._id}/tasks`,
      [NotificationType.COMPANY]: `/company`,
      [NotificationType.DIRECT_MESSAGE]: `/direct`,
      [NotificationType.VIDEO_CALL]: `/direct`,
    };

    return routeMap[notification.type] || '/';
  };

  // Tıklama işleyicisi
  const handleClick = () => {
    if (notification.isRead) return;
    console.log(notification);

    if (isGrouped && markGroupAsRead) {
      markGroupAsRead(`dm_${notification.content._id}`);
    } else {
      console.log('else gitdi');
      markNotificationAsRead({
        variables: {
          notificationId: notification._id,
        },
      });
    }
  };

  // Metin sınıfı
  const textClassName = notification.isRead ? 'text-gray-400' : 'text-white';

  return (
    <Link
      to={getNotificationRoute()}
      state={
        notification.type == NotificationType.TASK
          ? { backgroundLocation: location }
          : undefined
      }
      onClick={handleClick}
    >
      <p className={`font-bold ${textClassName}`}>
        {notification.sender.userName}
      </p>
      <p className={`text-sm ${textClassName}`}>{notification.message}</p>
    </Link>
  );
};

export default NotificationLink;
