import { gql } from '@apollo/client';

export const REMOVE_CHAT_ADMIN = gql`
  mutation RemoveChatAdmin($chatId: String!, $userId: String!) {
    removeChatAdmin(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;
