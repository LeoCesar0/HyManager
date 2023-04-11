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
import { makeDateFields, makeTransactionSlug } from "src/utils/app";
import { firebaseDB } from "src/services/firebase";
import { TransactionReport } from "../TransactionReport/schema";
import { getTransactionById } from "./read";
import { makeTransactionReportFields } from "../TransactionReport/utils";
import currency from "currency.js";
import { listTransactionReportsBy } from "../TransactionReport/read";
import { makeTransactionReport } from "../TransactionReport/utils";

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
    const createdTransactions: Transaction[] = [];

    values.forEach((transactionInputs) => {
      const date = new Date(transactionInputs.date);
      const firebaseTimestamp = Timestamp.fromDate(date);
      const now = new Date();
      const slugId = makeTransactionSlug({
        date: transactionInputs.date,
        amount: transactionInputs.amount.toString(),
        idFromBank: transactionInputs.idFromBank,
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
      transactionSchema.parse(transaction);
      const docRef = doc(firebaseDB, FirebaseCollection.transactions, slugId);

      createdTransactions.push(transaction);
      batch.set(docRef, transaction);
    });

    /* ------------------------------ MAKE REPORTS ------------------------------ */

    const reports: TransactionReport[] = createdTransactions.reduce(
      (acc, entry) => {
        let transactionReport = makeTransactionReportFields(entry, "month");
        const existingReportIndex = acc.findIndex(
          (item) => item.id === transactionReport.id
        );
        if (existingReportIndex >= 0) {
          const existingReport = acc[existingReportIndex];
          const updatedAmount = currency(existingReport.amount).add(
            entry.amount
          ).value;
          acc.splice(existingReportIndex, 1, {
            ...existingReport,
            amount: updatedAmount,
          });
        } else {
          acc.push(transactionReport);
        }

        return acc;
      },
      [] as TransactionReport[]
    );

    const { data: existingTransactionReports } = await listTransactionReportsBy(
      { bankAccountId: bankAccountId, type: "month" }
    );
    console.log("existingTransactionReports -->", existingTransactionReports);

    reports.forEach((transactionReport) => {
      const docRef = doc(
        firebaseDB,
        FirebaseCollection.transactionReports,
        transactionReport.id
      );
      const incrementAmount = increment(transactionReport.amount);
      const now = new Date();
      let updatedItem: any = {
        ...transactionReport,
        amount: incrementAmount,
        updatedAt: Timestamp.fromDate(now),
      };
      const alreadyExists = existingTransactionReports?.find(
        (item) => item.id === transactionReport.id
      );
      if (alreadyExists) {
        updatedItem = {
          amount: incrementAmount,
          updatedAt: Timestamp.fromDate(now),
        };
      }
      batch.set(docRef, updatedItem, { merge: true });
    });

    console.log("reports -->", reports);
    console.log("createdTransactions -->", createdTransactions);

    /* ------------------------------ COMMIT BATCH ------------------------------ */

    await batch.commit();

    const createdTransactionsIds = createdTransactions.map((item) => ({
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
