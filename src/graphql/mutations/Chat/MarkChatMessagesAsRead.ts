import { gql } from '@apollo/client';

export const MARK_CHAT_MESSAGES_AS_READ = gql`
  mutation MarkChatMessagesAsRead($chatId: String!) {
    markChatMessagesAsRead(chatId: $chatId)
  }
`;
