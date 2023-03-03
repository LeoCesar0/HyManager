import {
  GetAllBankAccountsDocument,
  GetAllBankAccountsQuery,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { AppModelResponse } from "../../types";
import { BankAccount } from "../../types/models/BankAccount";
import { debugDev } from "../../utils/dev";

type GetAllBankAccounts = AppModelResponse<BankAccount[]>;

// interface GetAllBankAccounts {
//   data: BankAccount[];
//   done: boolean;
//   error: { message: string } | null;
// }
export const getAllBankAccounts = async (): Promise<GetAllBankAccounts> => {
  const funcName = "getAllBankAccounts";

  return apolloClient
    .query<GetAllBankAccountsQuery>({
      query: GetAllBankAccountsDocument,
    })
    .then(({ data, error, errors }) => {
      const dataValue = data.bankAccounts || [];
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
