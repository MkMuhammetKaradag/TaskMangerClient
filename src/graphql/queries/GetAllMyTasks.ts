import { gql } from '@apollo/client';
export const GET_ALL_MY_TASKS = gql`
  query GetAllMyTasks {
    getAllMyTasks {
      _id
      title
      parentTask {
        _id
        title
      }
      subTasks {
        _id
        title
      }
      status
      priority
      dueDate
      description
    }
  }
`;
