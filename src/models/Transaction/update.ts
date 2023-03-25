import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseUpdate } from "..";
import { Transaction } from "./schema";

type PartialItem = Partial<Transaction>

interface IUpdateTransaction {
  values: PartialItem;
  id: string
}

export const updateTransaction = async ({
  values,
  id
}: IUpdateTransaction): Promise<AppModelResponse<Transaction>> => {
  const funcName = "updateTransaction";
  try {
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
