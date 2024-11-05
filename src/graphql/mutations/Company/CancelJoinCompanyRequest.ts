import { gql } from '@apollo/client';

export const CANCEL_JOIN_COMPANY_REQUEST = gql`
  mutation cancelJoinCompanyRequest($companyId: String!) {
    cancelJoinCompanyRequest(companyId: $companyId) {
      _id
      status
    }
  }
`;
