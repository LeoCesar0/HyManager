import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";
import {
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { makeDateFields, slugify } from "src/utils/app";
import { firebaseDB } from "src/services/firebase";
import { FirebaseCollection } from "@server/firebase";
import { makeTransactionSlug } from "@server/utils/makeTransactionSlug";
import { CreateTransaction, Transaction, transactionSchema } from "../schema";
import { batchManyTransactionReports } from "@models/TransactionReport/create/batchManyTransactionsReport";

interface ICreateManyTransactions {
  transactions: CreateTransaction[];
  bankAccountId: string;
}

export const createManyTransactions = async ({
  transactions: values,
  bankAccountId,
}: ICreateManyTransactions): Promise<AppModelResponse<{ id: string }[]>> => {
  const funcName = "createManyTransactions";

  try {
    const batch = writeBatch(firebaseDB);
    const transactionsOnCreate: Transaction[] = [];

    values.forEach((transactionInputs) => {
      const date = new Date(transactionInputs.date);
      const firebaseTimestamp = Timestamp.fromDate(date);
      const now = new Date();
      const slugId = makeTransactionSlug({
        date: transactionInputs.date,
        amount: transactionInputs.amount,
        idFromBank: transactionInputs.idFromBank,
        creditor: transactionInputs.creditor || "",
      });
      const transaction: Transaction = {
        ...transactionInputs,
        bankAccountId: bankAccountId,
        id: slugId,
        slug: slugId,
        date: firebaseTimestamp,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        ...makeDateFields(date),
      };
      if (transaction.creditor)
        transaction.creditorSlug = slugify(transaction.creditor);
      transactionSchema.parse(transaction);
      const docRef = doc(firebaseDB, FirebaseCollection.transactions, slugId);

      if (!transactionsOnCreate.some((item) => item.id === transaction.id)) {
        transactionsOnCreate.push(transaction);
        batch.set(docRef, transaction, { merge: true });
      }
    });


    /* ------------------------------ COMMIT BATCH ------------------------------ */

    await batchManyTransactionReports({
      bankAccountId,
      batch,
      transactionsOnCreate,
    });

    await batch.commit();

    const createdTransactionsIds = transactionsOnCreate.map((item) => ({
      id: item.id,
    }));
    return {
      data: createdTransactionsIds,
      done: true,
      error: null,
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
