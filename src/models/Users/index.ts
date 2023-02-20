import {
  CreateAppUserDocument,
  CreateAppUserMutation,
  CreateAppUserMutationVariables,
  PublishAppUserDocument,
  PublishAppUserMutation,
  PublishAppUserMutationVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";

export const publishUser = async (values: PublishAppUserMutationVariables) => {
  try {
    const { data, errors } = await apolloClient.mutate<PublishAppUserMutation>({
      mutation: PublishAppUserDocument,
      variables: values,
    });

    if ((errors?.length || 0) > 0) {
      console.log("publishUser errors -->", errors);
      return null;
    }

    const results = data?.publishAppUser;
    console.log("Successful publishUser -->", results);

    return results;
  } catch (errors) {
    console.log(`publishUser error -->`, errors);
    return null;
  }
};

export const createNewUser = async (values: CreateAppUserMutationVariables) => {
  try {
    const { data, errors } = await apolloClient.mutate<CreateAppUserMutation>({
      mutation: CreateAppUserDocument,
      variables: values,
    });

    if ((errors?.length || 0) > 0) {
      console.log("createNewUser errors -->", errors);
      return null;
    }
    const results = data?.createAppUser;
    console.log("Successful createNewUser -->", results);
    
    if (results) {
      await publishUser({ id: results.id });
    }

    return results;
  } catch (errors) {
    console.log(`createNewUser error -->`, errors);
    return null;
  }
};
