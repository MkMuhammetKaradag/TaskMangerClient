import { gql } from '@apollo/client';

export const GENERATE_SIGNED_URL = gql`
  mutation GenerateSignedUploadUrl($input: SignUrlInput!) {
    generateSignedUploadUrl(input: $input) {
      signature
      timestamp
      cloudName
      apiKey
    }
  }
`;
