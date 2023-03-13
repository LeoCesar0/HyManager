import { Transaction } from "@types-folder/models/Transaction";
import {
  GetTransactionsByBankDocument,
  GetTransactionsByBankQuery,
  GetTransactionsByBankQueryVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { AppModelResponse } from "../../types";
import { debugDev } from "../../utils/dev";

type GetAllBankAccounts = AppModelResponse<Transaction[]>;

export const GetTransactionsByBank = async (
  values: GetTransactionsByBankQueryVariables
): Promise<GetAllBankAccounts> => {
  const funcName = "GetTransactionsByBank";

  return apolloClient
    .query<GetTransactionsByBankQuery>({
      query: GetTransactionsByBankDocument,
      variables: values,
    })
    .then(({ data, error, errors }) => {
      const dataValue = data.transactions || [];
      if (data) {
        debugDev({
          type: "success",
          name: funcName,
          value: dataValue,
        });
        return {
          data: dataValue,
          error: null,
          done: true,
        };
      } else {
        debugDev({ type: "error", name: funcName, value: errors });
        debugDev({ type: "error", name: funcName, value: error });
        return {
          data: null,
          error: {
            message: "No Transaction",
          },
          done: false,
        };
      }
    })
    .catch((error) => {
      debugDev({ type: "error", name: funcName, value: error });
      return {
        data: null,
        error: error,
        done: false,
      };
    });
};
