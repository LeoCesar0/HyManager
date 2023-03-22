import {
  CreateTransactionDocument,
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  PublishTransactionDocument,
  PublishTransactionMutation,
  PublishTransactionMutationVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { debugDev } from "../../utils/dev";

export const publishTransaction = async (
  values: PublishTransactionMutationVariables
) => {
  const funcName = "publishTransaction";
  try {
    const { data, errors } =
      await apolloClient.mutate<PublishTransactionMutation>({
        mutation: PublishTransactionDocument,
        variables: values,
      });

    if ((errors?.length || 0) > 0) {
      debugDev({ type: "error", name: funcName, value: errors });
      return null;
    }

    const results = data?.publishTransaction;
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

interface CreateTransaction {
  done: boolean;
  data: CreateTransactionMutation["createTransaction"] | null;
  error: {
    message: string;
  } | null;
}

export const createTransaction = async (
  values: CreateTransactionMutationVariables
): Promise<CreateTransaction> => {
  const funcName = "createTransaction";

  try {
    const { data, errors } =
      await apolloClient.mutate<CreateTransactionMutation>({
        mutation: CreateTransactionDocument,
        variables: values,
      });
    let error = null;
    const createdItem = data?.createTransaction;

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
      const published = await publishTransaction({ id: createdItem.id });

      if (!published) {
        error = {
          message: `Error: Could not publish transaction`,
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

/* -------------------------------- MULTIPLE -------------------------------- */
