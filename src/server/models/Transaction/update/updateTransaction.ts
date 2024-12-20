import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { Transaction } from "../schema";

type PartialItem = Partial<Transaction>;

interface IUpdateTransaction {
  values: PartialItem;
  id: string;
}

export const updateTransaction = async ({
  values,
  id,
}: IUpdateTransaction): Promise<AppModelResponse<Transaction>> => {
  const funcName = "updateTransaction";
  try {
    if (values.amount) values.absAmount = Math.abs(values.amount);
    const result = await firebaseUpdate<Transaction>({
      collection: FirebaseCollection.transactions,
      data: values,
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
