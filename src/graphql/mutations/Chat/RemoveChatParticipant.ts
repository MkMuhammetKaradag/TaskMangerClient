import { gql } from '@apollo/client';

export const REMOVE_CHAT_PARTICIPANT = gql`
  mutation RemoveChatParticipant($chatId: String!, $userId: String!) {
    removeChatParticipant(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;
