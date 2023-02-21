import {
  CreateAppUserDocument,
  CreateAppUserMutation,
  CreateAppUserMutationVariables,
  PublishAppUserDocument,
  PublishAppUserMutation,
  PublishAppUserMutationVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { debugDev } from "../../utils/dev";

export const publishUser = async (values: PublishAppUserMutationVariables) => {
  const funcName = "publishUser";
  try {
    const { data, errors } = await apolloClient.mutate<PublishAppUserMutation>({
      mutation: PublishAppUserDocument,
      variables: values,
    });

    if ((errors?.length || 0) > 0) {
      debugDev({ type: "error", name: funcName, value: errors });
      return null;
    }

    const results = data?.publishAppUser;
    debugDev({
      type: "success",
      name: funcName,
      value: results,
    });

    return results;
  } catch (errors) {
    debugDev({ type: "error", name: funcName, value: errors });
    return null;
  }
};

interface CreateNewUser {
  done: boolean;
  data: CreateAppUserMutation["createAppUser"] | null;
  error: {
    message: string;
  } | null;
}
export const createNewUser = async (
  values: CreateAppUserMutationVariables
): Promise<CreateNewUser> => {
  const funcName = "createNewUser";

  try {
    const { data, errors } = await apolloClient.mutate<CreateAppUserMutation>({
      mutation: CreateAppUserDocument,
      variables: values,
    });
    let error = null;
    const results = data?.createAppUser;

    if ((errors?.length || 0) > 0) {
      error = debugDev({ type: "error", name: funcName, value: errors });

      return {
        data: results,
        done: !!results,
        error: {
          message: error,
        },
      };
    }

    debugDev({
      type: "success",
      name: funcName,
      value: results,
    });

    if (results?.uid) {
      await publishUser({ uid: results.uid });
    }

    return {
      data: results,
      done: !!results,
      error: error,
    };
  } catch (errors) {
    const error = debugDev({ type: "error", name: funcName, value: errors });
    console.log("ERROR HERE -->", error);
    return {
      data: null,
      done: false,
      error: {
        message: error,
      },
    };
  }
};
