import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { CreateTransaction, Transaction } from "./schema";
import { v4 as uuid } from "uuid";
import { serverTimestamp, Timestamp } from "firebase/firestore";

interface ICreateTransaction {
  values: CreateTransaction;
}

export const createTransaction = async ({
  values,
}: ICreateTransaction): Promise<AppModelResponse<Transaction>> => {
  const funcName = "getTransactionById";
  const item: Transaction = {
    ...values,
    id: uuid(),
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };
  try {
    const result = await firebaseCreate<Transaction>({
      collection: FirebaseCollection.transactions,
      data: item,
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
