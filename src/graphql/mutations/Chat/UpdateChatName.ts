import { gql } from '@apollo/client';

export const UPDATE_CHAT_NAME = gql`
  mutation UpdateChatName($chatId: String!, $name: String!) {
    updateChatName(chatId: $chatId, name: $name) {
      _id
      chatName
    }
  }
`;
