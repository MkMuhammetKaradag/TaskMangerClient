import { gql } from '@apollo/client';
export const GET_ALL_PROJECTS_BY_COMPANY = gql`
  query GetAllProjectsByCompany {
    getAllProjectsByCompany {
      _id
      name
      description
      startDate
      endDate
      status
    }
  }
`;
