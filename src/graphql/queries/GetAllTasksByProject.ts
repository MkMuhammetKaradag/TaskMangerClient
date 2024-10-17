import { gql } from '@apollo/client';
export const GET_ALL_TASKS_BY_PROJECT = gql`
  query GetAllTasksByProject($projectId: String!) {
    getAllTasksByProject(projectId: $projectId) {
      _id
      title
      description
      status
      priority
      dueDate
      parentTask {
        _id
      }
    }
  }
`;
