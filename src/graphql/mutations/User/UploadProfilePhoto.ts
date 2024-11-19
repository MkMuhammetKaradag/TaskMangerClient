import { gql } from '@apollo/client';

export const UPLOAD_PROFILE_PHOTO = gql`
  mutation UploadProfilePhoto($profilePhoto: String!) {
    uploadProfilePhoto(profilePhoto: $profilePhoto) {
      _id
    }
  }
`;
