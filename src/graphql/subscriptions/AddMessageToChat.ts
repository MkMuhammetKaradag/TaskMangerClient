import { gql } from '@apollo/client';
export const ADD_MESSAGE_TO_CHAT_SUBSCRIPTION = gql`
  subscription AddMessageToChat($chatId: String!) {
    addMessageToChat(chatId: $chatId) {
      _id
      content
      media {
        url
        type
        thumbnail
      }
      sender {
        _id
        userName
        profilePhoto
      }
    }
  }
`;
