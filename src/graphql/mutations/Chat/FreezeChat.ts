import { gql } from "@apollo/client";

export const FREEZE_CHAT = gql`
  mutation freezeChat($chatId: String!) {
    freezeChat(chatId: $chatId) {
      _id
    }
  }
`;