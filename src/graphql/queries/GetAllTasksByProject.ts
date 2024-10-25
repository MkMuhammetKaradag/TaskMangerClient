import { gql } from '@apollo/client';
export const GET_ALL_TASKS_BY_PROJECT = gql`
  query GetAllTasksByProject($projectId: String!) {
    getAllTasksByProject(projectId: $projectId) {
      tasks {
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
      project {
        projectManager {
          _id
        }
      }
    }
  }
`;
