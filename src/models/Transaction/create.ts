import { AppModelResponse } from "@types-folder/index";
import { debugDev, debugResults } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate, firebaseList } from "..";
import { CreateTransaction, Transaction, transactionSchema } from "./schema";
import {
  doc,
  increment,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { makeDateFields, slugify } from "src/utils/app";
import { firebaseDB } from "src/services/firebase";
import { TransactionReport } from "../TransactionReport/schema";
import { getTransactionById } from "./read";
import currency from "currency.js";
import { makeTransactionSlug } from "./utils";
import { batchManyTransactionReports } from "../TransactionReport/create";

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
  const now = new Date();
  const slugId = makeTransactionSlug({
    date: values.date,
    amount: values.amount.toString(),
    idFromBank: values.idFromBank,
    creditor: values.creditor || "",
  });
  const transaction: Transaction = {
    ...values,
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
  try {
    transactionSchema.parse(transaction);

    const batch = writeBatch(firebaseDB);
    const transactionsRef = doc(
      firebaseDB,
      FirebaseCollection.transactionReports,
      transaction.id
    );

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

    // const result = await firebaseCreate<Transaction>({
    //   collection: FirebaseCollection.transactions,
    //   data: transaction,
    // });
    // const createdTransactionResult = await getTransactionById({ id: slugId });
    // const createdTransaction = createdTransactionResult.data;
    // if (result.done && createdTransaction) {
    //   const transactionReport = await makeTransactionReport({
    //     transaction: createdTransaction,
    //     type: "month",
    //   });
    //   if (transactionReport.error) {
    //     debugResults(transactionReport, funcName);
    //   }
    // }
    // return result;
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

    console.log("values -->", values);

    values.forEach((transactionInputs) => {
      const date = new Date(transactionInputs.date);
      const firebaseTimestamp = Timestamp.fromDate(date);
      const now = new Date();
      const slugId = makeTransactionSlug({
        date: transactionInputs.date,
        amount: transactionInputs.amount.toString(),
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

    console.log("createdTransactions -->", transactionsOnCreate);

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
