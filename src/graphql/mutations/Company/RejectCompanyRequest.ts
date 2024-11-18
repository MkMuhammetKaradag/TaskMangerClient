import { gql } from '@apollo/client';

export const REJECT_COMPANY_REQUEST = gql`
  mutation RejectCompanyRequest($requestId: String!, $reason: String!) {
    rejectCompanyRequest(requestId: $requestId, reason: $reason) {
      _id
    }
  }
`;
