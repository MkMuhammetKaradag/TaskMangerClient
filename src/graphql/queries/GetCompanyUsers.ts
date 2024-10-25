import { gql } from '@apollo/client';

export const GET_COMPANY_USERS = gql`
  query getCompanyUsers {
    getCompanyUsers {
      _id
      firstName
      lastName
      roles
    }
  }
`;
