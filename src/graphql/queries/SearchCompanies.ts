import { gql } from '@apollo/client';

export const SEARCH_COMPANIES = gql`
  query searchCompanies($input: SearchCompaniesInput!) {
    searchCompanies(input: $input) {
      companies {
        _id
        name
        phoneNumber
      }
      totalCount
    }
  }
`;
