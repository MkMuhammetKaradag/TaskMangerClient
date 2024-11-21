import { User } from '../redux';

export enum JoinRequestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}
export type JoinRequest = {
  _id: string;
  status: JoinRequestStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
  company: {
    _id: string;
    name: string;
  };
};
