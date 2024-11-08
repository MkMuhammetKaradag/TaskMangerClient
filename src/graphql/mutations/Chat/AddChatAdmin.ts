import { gql } from '@apollo/client';

export const ADD_CHAT_ADMIN = gql`
  mutation AddChatAdmin($chatId: String!, $userId: String!) {
    addChatAdmin(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;
