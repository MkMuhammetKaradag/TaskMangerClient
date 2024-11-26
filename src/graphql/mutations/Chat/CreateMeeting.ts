import { gql } from '@apollo/client';

export const CREATE_MEETING = gql`
  mutation CreateMeeting($token: String!, $chatId: String!) {
    createMeeting(token: $token, chatId: $chatId) {
      roomId
      apiKey
      customRoomId
      customMeetingId
      links {
        get_room
        get_session
      }
    }
  }
`;
