import {
  CreateAppUserDocument,
  CreateAppUserMutation,
  CreateAppUserMutationVariables,
  GetAllAppUsersDocument,
  GetAllAppUsersQuery,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { z } from "zod";
import { gql } from "@apollo/client";

// const CreateAppUserQuery = gql`
//   mutation CreateAppUser(
//     $name: String!
//     $email: String!
//     $userId: String!
//     $imageUrl: String
//     $bio: String
//   ) {
//     createAppUser(
//       data: {
//         name: $name
//         email: $email
//         userId: $userId
//         imageUrl: $imageUrl
//         bio: $bio
//       }
//     ) {
//       id
//       name
//       email
//       imageUrl
//     }
//   }
// `;

const getQuery = gql`
  query GetAllAppUsers {
    appUsers(orderBy: name_ASC) {
      imageUrl
      name
      id
      email
      userId
      createdAt
    }
  }
`;

export const createNewUser = async (values: CreateAppUserMutationVariables) => {
  try {
    const { data } = await apolloClient.mutate<CreateAppUserMutation>({
      mutation: CreateAppUserDocument,
      variables: values,
    });

    return data?.createAppUser;
  } catch (errors) {
    console.log(`createNewUser error -->`, errors.message);
  }
};
