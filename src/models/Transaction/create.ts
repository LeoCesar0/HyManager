import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { CreateTransaction, Transaction, transactionSchema } from "./schema";
import { v4 as uuid } from "uuid";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
import { makeDateFields, makeTransactionSlug } from "src/utils/app";
import { firebaseDB } from "src/services/firebase";

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
  const item: Transaction = {
    ...values,
    bankAccountId: bankAccountId,
    id: uuid(),
    slug: makeTransactionSlug({
      date: values.date,
      amount: values.amount.toString(),
      idFromBank: values.idFromBank,
    }),
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
      const id = uuid();
      const now = new Date();
      const item: Transaction = {
        ...transactionInputs,
        bankAccountId: bankAccountId,
        id: id,
        slug: makeTransactionSlug({
          date: transactionInputs.date,
          amount: transactionInputs.amount.toString(),
          idFromBank: transactionInputs.idFromBank,
        }),
        date: firebaseTimestamp,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        ...makeDateFields(date),
      };
      transactionSchema.parse(item);
      const docRef = doc(firebaseDB, FirebaseCollection.transactions, id);
      batch.set(docRef, item);
      createdTransactionsIds.push({ id: id });
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
