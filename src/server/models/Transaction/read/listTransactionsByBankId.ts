import { AppModelResponse, FirebaseFilterFor } from "@types-folder/index";
import { FirebaseCollection } from "src/server/firebase";
import { firebaseGet } from "src/server/firebase/firebaseGet";
import { firebaseList } from "src/server/firebase/firebaseList";
import { debugDev } from "src/utils/dev";
import { Transaction } from "../schema";

interface IListTransactionByBankId {
  id: string;
  filters?: FirebaseFilterFor<Transaction>[];
}
export const listTransactionsByBankId = async ({
  id,
  filters = [],
}: IListTransactionByBankId): Promise<AppModelResponse<Transaction[]>> => {
  const funcName = "getTransactionById";

  try {
    const result = await firebaseList<Transaction>({
      collection: FirebaseCollection.transactions,
      filters: [
        { field: "bankAccountId", operator: "==", value: id },
        ...filters,
      ],
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
