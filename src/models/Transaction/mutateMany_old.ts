import {
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
} from "@graphql-folder/generated";
import { debugDev } from "src/utils/dev";
import { createTransaction } from "./mutate";

// const throttle = pThrottle({
// 	limit: 2,
// 	interval: 1000
// });

interface CreateTransactions {
  done: boolean;
  data: Array<CreateTransactionMutation["createTransaction"]>;
  missingItems: Array<CreateTransactionMutationVariables>;
  errors:
    | {
        message: string;
      }[]
    | null;
}

export const createManyTransactions = async (
  values: Array<CreateTransactionMutationVariables>
): Promise<CreateTransactions> => {
  const funcName = "createTransactions";
  try {
    const results = await Promise.all(
      values.map((inputs) => createTransaction(inputs))
    );
    const errors = results
      .map((item) => item.error)
      .filter((item) => !!item) as CreateTransactions["errors"];
    const createdItems = results
      .map((item) => item.data)
      .filter((item) => !!item);

    errors?.forEach((error) => {
      debugDev({ type: "error", name: funcName, value: error });
    });

    const missingItems: CreateTransactions["missingItems"] = [];
    results.forEach((item, index) => {
      if (!item.done) {
        const inputsForCurrentItem = values[index];
        missingItems.push(inputsForCurrentItem);
      }
    });

    return {
      data: createdItems,
      done: createdItems.length > 0,
      errors: errors,
      missingItems: missingItems,
    };
  } catch (errors) {
    const error = debugDev({ type: "error", name: funcName, value: errors });
    return {
      data: [],
      done: false,
      errors: [
        {
          message: error,
        },
      ],
      missingItems: values,
    };
  }
};
