import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { CreateTransaction, Transaction, transactionSchema } from "./schema";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";
import { makeTransactionSlug } from "src/utils/app";

interface ICreateTransaction {
  values: CreateTransaction;
  bankAccountId: string;
}

export const createTransaction = async ({
  values,
  bankAccountId,
}: ICreateTransaction): Promise<AppModelResponse<Transaction>> => {
  const funcName = "createTransaction";
  const date = new Date(values.date);
  const firebaseTimestamp = Timestamp.fromDate(date);
  const item: Transaction = {
    ...values,
    bankAccountId: bankAccountId,
    id: uuid(),
    slug: makeTransactionSlug({
      date: values.date,
      amount: values.amount.toString(),
    }),
    date: firebaseTimestamp,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  };
  try {
    console.log('item -->', item)
    transactionSchema.parse(item);

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
