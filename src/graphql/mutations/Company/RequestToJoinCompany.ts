import { gql } from '@apollo/client';

export const REQUEST_TO_JOIN_COMPANY = gql`
  mutation requestToJoinCompany($companyId: String!) {
    requestToJoinCompany(companyId: $companyId) {
      _id
      status
    }
  }
`;
