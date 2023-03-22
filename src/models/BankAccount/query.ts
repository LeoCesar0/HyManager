import {
  GetUserBankAccountsDocument,
  GetUserBankAccountsQuery,
  GetUserBankAccountsQueryResult,
  GetUserBankAccountsQueryVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { AppModelResponse } from "../../types";
import { BankAccount } from "../../types/models/BankAccount";
import { debugDev } from "../../utils/dev";

type GetAllBankAccounts = AppModelResponse<BankAccount[]>;

export const getUserBankAccounts = async (
  values: GetUserBankAccountsQueryVariables
): Promise<GetAllBankAccounts> => {
  const funcName = "getUserBankAccounts";

  return apolloClient
    .query<GetUserBankAccountsQuery>({
      query: GetUserBankAccountsDocument,
      variables: values,
    })
    .then(({ data, error, errors }) => {
      if (data.bankAccounts) {
        const dataValue = data.bankAccounts || [];
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
            message: "No bank account found",
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
