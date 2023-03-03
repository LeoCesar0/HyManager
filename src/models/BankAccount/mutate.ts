import {
  CreateAppUserDocument,
  CreateBankAccountMutation,
  CreateBankAccountMutationVariables,
  PublishBankAccountDocument,
  PublishBankAccountMutation,
  PublishBankAccountMutationVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { debugDev } from "../../utils/dev";

export const publishBankAccount = async (
  values: PublishBankAccountMutationVariables
) => {
  const funcName = "publishBankAccount";
  try {
    const { data, errors } =
      await apolloClient.mutate<PublishBankAccountMutation>({
        mutation: PublishBankAccountDocument,
        variables: values,
      });

    if ((errors?.length || 0) > 0) {
      debugDev({ type: "error", name: funcName, value: errors });
      return null;
    }

    const results = data?.publishBankAccount;
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
  data: CreateBankAccountMutation["createBankAccount"] | null;
  error: {
    message: string;
  } | null;
}
export const createBankAccount = async (
  values: CreateBankAccountMutationVariables
): Promise<CreateNewUser> => {
  const funcName = "createBankAccount";

  try {
    const { data, errors } =
      await apolloClient.mutate<CreateBankAccountMutation>({
        mutation: CreateAppUserDocument,
        variables: values,
      });
    let error = null;
    const results = data?.createBankAccount;

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

    if (results?.id) {
      const published = await publishBankAccount({ id: results.id });

      if (!published) {
        error = {
          message: `Error ${funcName} --> Item not published!`,
        };
      }

      return {
        data: published ? results : null,
        done: !!published,
        error: error,
      };
    }
    // DID NOT PUBLISHED
    return {
      data: null,
      done: false,
      error: error,
    };
  } catch (errors) {
    const error = debugDev({ type: "error", name: funcName, value: errors });
    return {
      data: null,
      done: false,
      error: {
        message: error,
      },
    };
  }
};
