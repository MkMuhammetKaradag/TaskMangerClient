import { gql } from '@apollo/client';

export const GET_MESSAGE_READERS = gql`
  query GetMessageReaders($messageId: String!) {
    getMessageReaders(messageId: $messageId) {
      _id
      isRead {
        _id
        profilePhoto
        userName
      }
    }
  }
`;
