import { User } from '../../types/redux';

export enum NotificationContentType {
  TASK = 'Task',
  PROJECT = 'Project',
  COMPANY = 'Company',
  USER = 'User',
}

// Content interfaces
export interface NotificationContentTask {
  _id: string; // Post ID
}

// export interface NotificationContentUser{
//     _id: string; // Post ID
//   }
export interface NotificationContentTask {
  _id: string; // Post ID
}

export interface NotificationContentProject {
  _id: string; // Like ID
  createdAt: string; // Like creation date
}

export interface NotificationContentCompany {
  _id: string; // Comment ID
  content: string; // The content of the comment
}

export enum NotificationType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  COMPANY = 'COMPANY',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
}

// Conditional type to determine the content type based on contentType
export type NotificationContent<T extends NotificationContentType> =
  T extends NotificationContentType.COMPANY
    ? NotificationContentCompany
    : T extends NotificationContentType.PROJECT
    ? NotificationContentProject
    : T extends NotificationContentType.TASK
    ? NotificationContentTask
    : T extends NotificationContentType.USER
    ? User
    : never;

// Generic notification interface
export interface NotificationGeneric<T extends NotificationContentType> {
  _id: string;
  message: string;
  isRead: boolean;
  contentType: T;
  type: NotificationType;
  sender: User;
  content: NotificationContent<T>;
}

// Union type for all possible notification types
export type AnyNotification =
  | NotificationGeneric<NotificationContentType.COMPANY>
  | NotificationGeneric<NotificationContentType.PROJECT>
  | NotificationGeneric<NotificationContentType.TASK>
  | NotificationGeneric<NotificationContentType.USER>;

// Now you can use this type for an array of notifications
export type NotificationArray = AnyNotification[];
