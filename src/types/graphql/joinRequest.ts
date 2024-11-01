import { User } from '../redux';

export enum JoinRequestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}
export type JoinRequest = {
  _id: string;
  status: JoinRequestStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
};
