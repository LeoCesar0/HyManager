import {
  CreateAppUserDocument,
  CreateBankAccountDocument,
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

  console.log("values -->", values);

  try {
    const { data, errors } =
      await apolloClient.mutate<CreateBankAccountMutation>({
        mutation: CreateBankAccountDocument,
        variables: values,
      });
    let error = null;
    const createdItem = data?.createBankAccount;

    if ((errors?.length || 0) > 0) {
      error = debugDev({ type: "error", name: funcName, value: errors });

      return {
        data: createdItem,
        done: !!createdItem,
        error: {
          message: error,
        },
      };
    }

    debugDev({
      type: "success",
      name: funcName,
      value: createdItem,
    });

    if (createdItem?.id) {
      const published = await publishBankAccount({ id: createdItem.id });

      if (!published) {
        error = {
          message: `Error: Could not publish bank account`,
        };
      }

      return {
        data: published ? createdItem : null,
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
