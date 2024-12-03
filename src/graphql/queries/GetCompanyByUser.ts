import { gql } from "@apollo/client";

export const GET_COMPANY = gql`
  query getCompanyByUser($companyId: String) {
    getCompanyByUser(companyId: $companyId) {
      company {
        _id
        name
        address
        phoneNumber
        website
        createdAt
        updatedAt
      }
      isCompanyEmploye
      showCompanyjoinButton
      isJoinRequest
    }
  }
`;