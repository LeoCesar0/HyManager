import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import {
  FirebaseCollection,
  firebaseCreate,
  firebaseGet,
  firebaseList,
} from "..";
import {
  TransactionMin,
  TransactionReport,
  transactionReportSchema,
} from "./schema";
import {
  arrayUnion,
  doc,
  FieldValue,
  increment,
  Timestamp,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { Transaction } from "../Transaction/schema";
import { timestampToDate } from "src/utils/misc";
import {
  makeTransactionReportFields,
  makeTransactionReportSlugId,
} from "./utils";
import currency from "currency.js";
import {
  listTransactionReportByTransaction,
  listTransactionReportsBy,
} from "./read";
import { listTransactionsByBankId } from "../Transaction/read";

interface ICreateTransactionReport {
  transaction: Transaction;
  type: TransactionReport["type"];
}

export const createTransactionReport = async ({
  transaction,
  type,
}: ICreateTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "createTransactionReport";

  try {
    const newTransactionReport = makeTransactionReportFields(transaction, type);

    transactionReportSchema.parse(newTransactionReport);

    const result = await firebaseCreate<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      data: newTransactionReport,
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

interface IBatchManyTransactionReports {
  batch: WriteBatch;
  transactionsOnCreate: Transaction[];
  bankAccountId: string;
}

export const batchManyTransactionReports = async ({
  batch,
  transactionsOnCreate,
  bankAccountId,
}: IBatchManyTransactionReports) => {
  const funcName = "batchManyTransactionReports";

  const now = new Date();

  const listResults = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
  });
  const existingReportsOnDatabase = listResults.data || [];

  const makeReportsByType = (type: TransactionReport["type"]) => {
    const reports: TransactionReport[] = transactionsOnCreate.reduce(
      (acc, entry) => {
        let transactionReport = makeTransactionReportFields(entry, type);
        const existingReportIndex = acc.findIndex(
          (item) => item.id === transactionReport.id
        );

        const currentReportInDatabase = existingReportsOnDatabase.find(
          (item) => item.id === transactionReport.id
        );

        if (existingReportIndex >= 0) {
          const existingReport = acc[existingReportIndex];

          const updatedAmount = currency(existingReport.amount).add(
            entry.amount
          ).value;
          const transactionMin: TransactionMin = {
            amount: entry.amount,
            id: entry.id,
            type: entry.type,
            creditor: entry.creditor || "",
            creditorSlug: entry.creditor || "",
          };
          const existingTransactionsInAcc = existingReport.transactions;
          const thisTransactionWasAlreadyIncluded =
            existingTransactionsInAcc.some(
              (item) => item.id === transactionMin.id
            );
          if (!thisTransactionWasAlreadyIncluded) {
            acc.splice(existingReportIndex, 1, {
              ...existingReport,
              amount: updatedAmount,
              transactions: [...existingTransactionsInAcc, transactionMin],
            });
          }
        } else {
          if (!currentReportInDatabase) {
            acc.push(transactionReport);
          }
          if (
            currentReportInDatabase &&
            !currentReportInDatabase.transactions.some(
              (item) => item.id === entry.id
            )
          ) {
            acc.push(transactionReport);
          }
        }

        return acc;
      },
      [] as TransactionReport[]
    );
    return reports;
  };

  /* ------------------------------ MAKE REPORTS ------------------------------ */
  const monthReports = makeReportsByType("month");
  const dayReports = makeReportsByType("day");

  const reports = dayReports.concat(monthReports);

  reports.forEach(async (transactionReport) => {
    const docRef = doc(
      firebaseDB,
      FirebaseCollection.transactionReports,
      transactionReport.id
    );

    const incrementAmount = increment(transactionReport.amount);
    let updatedItem: Omit<TransactionReport, "amount" | "transactions"> & {
      amount: any;
      transactions: any;
    } = {
      ...transactionReport,
      amount: incrementAmount,
      updatedAt: Timestamp.fromDate(now),
      transactions: [],
    };
    if (transactionReport.transactions.length > 0) {
      updatedItem = {
        ...updatedItem,
        transactions: arrayUnion(...transactionReport.transactions),
      };
    }

    batch.set(docRef, updatedItem, { merge: true });
  });
};

interface ICreateManyTransactionReports {
  values: TransactionReport[];
}

export const createManyTransactionReports = async ({
  values,
}: ICreateManyTransactionReports): Promise<
  AppModelResponse<{ id: string }[]>
> => {
  const funcName = "createManyTransactionReports";

  try {
    const batch = writeBatch(firebaseDB);
    const createdTransactionReportsIds: { id: string }[] = [];

    values.forEach((transactionReportInputs) => {
      transactionReportInputs.id = makeTransactionReportSlugId({
        backAccountId: transactionReportInputs.bankAccountId,
        date: timestampToDate(transactionReportInputs.date),
        type: "month",
      });
      transactionReportSchema.parse(transactionReportInputs);
      const id = transactionReportInputs.id;
      const docRef = doc(firebaseDB, FirebaseCollection.transactionReports, id);
      batch.set(docRef, transactionReportInputs);
      createdTransactionReportsIds.push({ id: id });
    });

    await batch.commit();

    return {
      data: createdTransactionReportsIds,
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
