import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseGet, firebaseList } from "..";
import { Transaction } from "./schema";

interface IGetTransactionById {
  id: string;
}

export const getTransactionById = async ({
  id,
}: IGetTransactionById): Promise<AppModelResponse<Transaction>> => {
  const funcName = "getTransactionById";

  try {
    const result = await firebaseGet<Transaction>({
      collection: FirebaseCollection.transactions,
      id: id,
    });
    return result;
  } catch (error) {
    const errorMessage = debugDev({
      type: "error",
      name: funcName,
      value: error,
    });
    return {
      data: null,
      done: false,
      error: {
        message: errorMessage,
      },
    };
  }
};

interface IListTransactionByBankId {
  id: string;
}
export const listTransactionsByBankId = async ({
  id,
}: IListTransactionByBankId): Promise<AppModelResponse<Transaction[]>> => {
  const funcName = "getTransactionById";

  console.log("Calling listTransactionsByBankId");

  try {
    const result = await firebaseList<Transaction>({
      collection: FirebaseCollection.transactions,
      filters: [{ field: "bankAccountId", operator: "==", value: id }],
    });
    return result;
  } catch (error) {
    const errorMessage = debugDev({
      type: "error",
      name: funcName,
      value: error,
    });
    return {
      data: null,
      done: false,
      error: {
        message: errorMessage,
      },
    };
  }
};
