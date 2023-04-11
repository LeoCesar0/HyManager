import { AppModelResponse } from "@types-folder/index";
import { debugDev, debugResults } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate, firebaseList } from "..";
import { CreateTransaction, Transaction, transactionSchema } from "./schema";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
import { makeDateFields, makeTransactionSlug } from "src/utils/app";
import { firebaseDB } from "src/services/firebase";
import { TransactionReport } from "../TransactionReport/schema";
import { makeTransactionReport } from "./utils";
import { getTransactionById } from "./read";

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
  });
  const item: Transaction = {
    ...values,
    bankAccountId: bankAccountId,
    id: slugId,
    slug: slugId,
    date: firebaseTimestamp,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    ...makeDateFields(date),
  };
  try {
    transactionSchema.parse(item);

    const result = await firebaseCreate<Transaction>({
      collection: FirebaseCollection.transactions,
      data: item,
    });
    const createdTransactionResult = await getTransactionById({ id: slugId });
    const createdTransaction = createdTransactionResult.data;
    if (result.done && createdTransaction) {
      const transactionReport = await makeTransactionReport({
        transaction: createdTransaction,
        type: "month",
      });
      if (transactionReport.error) {
        debugResults(transactionReport, funcName);
      }
    }
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

interface ICreateManyTransactions {
  values: CreateTransaction[];
  bankAccountId: string;
}

export const createManyTransactions = async ({
  values,
  bankAccountId,
}: ICreateManyTransactions): Promise<AppModelResponse<{ id: string }[]>> => {
  const funcName = "createManyTransactions";

  try {
    const batch = writeBatch(firebaseDB);
    const createdTransactionsIds: { id: string }[] = [];
    values.forEach((transactionInputs) => {
      const date = new Date(transactionInputs.date);
      const firebaseTimestamp = Timestamp.fromDate(date);
      const now = new Date();
      const slugId = makeTransactionSlug({
        date: transactionInputs.date,
        amount: transactionInputs.amount.toString(),
        idFromBank: transactionInputs.idFromBank,
      });
      const item: Transaction = {
        ...transactionInputs,
        bankAccountId: bankAccountId,
        id: slugId,
        slug: slugId,
        date: firebaseTimestamp,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        ...makeDateFields(date),
      };
      transactionSchema.parse(item);
      const docRef = doc(firebaseDB, FirebaseCollection.transactions, slugId);
      batch.set(docRef, item);
      createdTransactionsIds.push({ id: slugId });
    });

    await batch.commit();

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
