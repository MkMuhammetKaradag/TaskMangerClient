import { gql } from '@apollo/client';

export const MARK_MESSAGES_AS_READ = gql`
  mutation MarkMessagesAsRead($messageIds: [String!]!) {
    markMessagesAsRead(messageIds: $messageIds)
  }
`;
