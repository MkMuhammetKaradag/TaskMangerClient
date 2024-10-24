export enum UserRole {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
  EXECUTIVE = 'EXECUTIVE',
  USER = 'USER',
}
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profilePhoto: string;
  roles: UserRole[];
}
