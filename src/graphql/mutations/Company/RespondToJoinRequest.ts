import { gql } from '@apollo/client';
export const RESPOND_TO_JOIN_REQUEST = gql`
  mutation RespondToJoinRequest($requestId: String!, $approve: Boolean!) {
    respondToJoinRequest(requestId: $requestId, approve: $approve) {
      _id
    }
  }
`;
