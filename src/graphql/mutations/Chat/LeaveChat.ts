import { gql } from '@apollo/client';

export const LEAVE_CHAT_MUTATION = gql`
  mutation LeaveChat($chatId: String!) {
    leaveChat(chatId: $chatId)
  }
`;
