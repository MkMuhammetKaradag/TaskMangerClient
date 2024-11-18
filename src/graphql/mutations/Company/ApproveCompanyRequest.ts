import { gql } from '@apollo/client';

export const APPROVE_COMPANY_REQUEST = gql`
  mutation ApproveCompanyRequest($requestId: String!) {
    approveCompanyRequest(requestId: $requestId) {
      _id
    }
  }
`;
