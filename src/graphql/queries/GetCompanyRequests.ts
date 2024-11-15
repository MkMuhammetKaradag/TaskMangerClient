import { gql } from '@apollo/client';

export const GET_COMPANY_REQUESTS = gql`
  query GetcompanyRequest($status: CompanyRequestStatus!) {
    getCompanyRequests(status: $status) {
      _id
      name
      createdAt
      updatedAt
      user {
        _id
        firstName
        lastName
        userName
        profilePhoto
      }
    }
  }
`;
