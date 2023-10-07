import { AppModelResponse } from "@/@types/index";
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
    const data = await firebaseGet<Transaction>({
      collection: FirebaseCollection.transactions,
      id: id,
    });
    return {
      data: data || null,
      done: !!data,
      error: data
        ? null
        : {
            message: debugDev({
              type: "error",
              name: funcName,
              value: "Error",
            }),
          },
    };
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
