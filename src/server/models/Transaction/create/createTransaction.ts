import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { CreateTransaction, Transaction, transactionSchema } from "../schema";
import {  writeBatch } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from "@server/firebase";
import { batchManyTransactionReports } from "@models/TransactionReport/create/batchManyTransactionsReport";
import { createDocRef } from "@/server/utils/createDocRef";
import { makeTransactionFields } from "../utils/makeTransactionFields";

interface ICreateTransaction {
  values: CreateTransaction;
  bankAccountId: string;
}

export const createTransaction = async ({
  values,
  bankAccountId,
}: ICreateTransaction): Promise<AppModelResponse<Transaction>> => {
  const funcName = "createTransaction";

  const transaction = makeTransactionFields({
    transactionInputs: values,
    bankAccountId: bankAccountId,
  });

  try {
    transactionSchema.parse(transaction);

    const batch = writeBatch(firebaseDB);

    let path = "";
    if (process.env.NODE_ENV === "production") {
      path = "production";
    } else if (process.env.NODE_ENV === "development") {
      path = "development";
    } // Add more conditions if needed

    const transactionsRef = createDocRef({
      collection: FirebaseCollection.transactions,
      id: transaction.id,
    });

    batch.set(transactionsRef, transaction);

    await batchManyTransactionReports({
      bankAccountId: bankAccountId,
      batch: batch,
      transactionsOnCreate: [transaction],
    });

    await batch.commit();

    return {
      done: true,
      error: null,
      data: transaction,
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
