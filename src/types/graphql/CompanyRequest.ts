import { User } from '../redux';

export enum CompanyRequestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export type CompanyRequest = {
  _id: string;
  name: string;
  status: CompanyRequestStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
};
