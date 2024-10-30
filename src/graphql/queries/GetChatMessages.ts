import { gql } from '@apollo/client';

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessageS($input: GetChatMessagesInput!) {
    getChatMessages(input: $input) {
      messages {
        _id
        content
        type
        messageIsReaded
        media {
          _id
          type
          url
        }
        sender {
          _id
          userName
          profilePhoto
        }
      }
      totalMessages
      totalPages
      currentPage
    }
  }
`;
