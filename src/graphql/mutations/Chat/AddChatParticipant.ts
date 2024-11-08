import { gql } from '@apollo/client';

export const ADD_CHAT_PARTICIPANT = gql`
  mutation AddChatParticipant($chatId: String!, $userId: String!) {
    addChatParticipant(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;
