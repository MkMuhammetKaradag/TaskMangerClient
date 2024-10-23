import { gql } from '@apollo/client';
export const GET_TASK = gql`
  query GetTask($taskId: String!) {
    getTask(taskId: $taskId) {
      _id
      title
      description
      project {
        _id
        name
      }
      assignee {
        _id
        firstName
        lastName
      }
      parentTask {
        _id
        title
      }
      createdByUser {
        _id
        firstName
        lastName
      }
      subTasks {
        _id
        title
      }
      status
      priority
      dueDate
    }
  }
`;
