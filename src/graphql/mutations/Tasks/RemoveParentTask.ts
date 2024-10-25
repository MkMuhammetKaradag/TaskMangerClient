import { gql } from '@apollo/client';
export const REMOVE_PARENT_TASK = gql`
  mutation RemoveParentTask($taskId: String!) {
    removeParentTask(taskId: $taskId)
  }
`;
