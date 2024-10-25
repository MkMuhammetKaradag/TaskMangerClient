import { gql } from '@apollo/client';
export const UPDATE_TASK_HIERARCHY = gql`
  mutation UpdateTaskHierarchy($input: UpdateTaskHierarchyInput!) {
    updateTaskHierarchy(input: $input) {
      _id
    }
  }
`;
