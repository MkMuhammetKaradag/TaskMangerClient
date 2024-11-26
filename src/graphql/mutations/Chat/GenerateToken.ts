import { gql } from '@apollo/client';

export const GENERATE_TOKEN = gql`
  mutation GenerateToken($chatId: String!) {
    generateToken(chatId: $chatId)
  }
`;
