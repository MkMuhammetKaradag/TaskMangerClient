import { gql } from '@apollo/client';

export const GET_COMPANY_JOIN_REQUESTS = gql`
  query GetCompanyJoinRequests(
    $companyId: String
    $status: JoinRequestStatus!
  ) {
    getCompanyJoinRequests(companyId: $companyId, status: $status) {
      _id
      status
      createdAt
      updatedAt
      user {
        _id
        userName
        profilePhoto
      }
    }
  }
`;
