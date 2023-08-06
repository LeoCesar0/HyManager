import { AppModelResponse, FirebaseFilterFor } from "@types-folder/index";
import { FirebaseCollection } from "@server/firebase";
import { firebaseGet } from "@server/firebase/firebaseGet";
import { debugDev } from "@utils/dev";
import { Transaction } from "../schema";

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
