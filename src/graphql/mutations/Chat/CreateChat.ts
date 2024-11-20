import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
      _id
    }
  }
`;
