import { gql } from '@apollo/client';

export const GET_MY_COMPANY_MEMBERSHIP_REQUESTS = gql`
  query GetMyCompanyMembershipRequests($status: JoinRequestStatus!) {
    getMyCompanyMembershipRequests(status: $status) {
      _id
      status
      createdAt
      updatedAt
      user {
        _id
        userName
        profilePhoto
      }
      company {
        _id
        name
      }
    }
  }
`;
