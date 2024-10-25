import { gql } from '@apollo/client';
export const GET_PROJECTS_BY_COMPANY = gql`
  query GetProjectsByCompany {
    getProjectsByCompany {
      _id
      name
    }
  }
`;
