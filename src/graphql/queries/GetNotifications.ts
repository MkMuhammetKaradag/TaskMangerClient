import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      _id
      message
      isRead
      contentType
      type
      sender {
        _id
        userName
        profilePhoto
      }
      content {
        ... on Project {
          _id
        }
        ... on Task {
          _id
        }
        ... on Company {
          _id
        }
        ... on User {
          _id
          userName
          profilePhoto
        }
      }
    }
  }
`;
