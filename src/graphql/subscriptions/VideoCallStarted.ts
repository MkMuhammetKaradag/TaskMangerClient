import { gql } from '@apollo/client';
export const VIDEO_CALL_STARTED  = gql`
  subscription videoCallStarted($userId: String!) {
    videoCallStarted(userId: $userId) {
      chatId
      participants
      userName
    }
  }
`;
