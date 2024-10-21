import { gql } from '@apollo/client';
export const GET_PROJECT_WITH_DETAILS = gql`
  query GetProjectWithDetails($projectId: String!) {
    getProjectWithDetails(projectId: $projectId) {
      _id
      name
      startDate
      endDate
      status
      description
      projectManager {
        _id
        firstName
        lastName
        profilePhoto
      }
      team {
        _id
        firstName
        lastName
        profilePhoto
      }
      taskSummary {
        totalTasks
        todoTasks
        in_progressTasks
        reviewTasks
        doneTasks
      }
      tasks {
        _id
        title
        description
        status
        assignee {
          _id
          firstName
          lastName
          profilePhoto
        }
      }
    }
  }
`;
