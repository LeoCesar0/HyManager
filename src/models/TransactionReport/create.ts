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
  transactionsToTransactionsReport,
} from "./utils";
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

  const t1 = performance.now();

  const listResults = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
  });

  const t2 = performance.now();

  console.log(`listResults took ${t2 - t1} ms`);

  const existingReportsOnDatabase = listResults.data || [];

  // const existingReportsOnDatabaseMap = existingReportsOnDatabase.reduce(
  //   (acc, entry) => {
  //     acc.set(entry.id, entry);
  //     return acc;
  //   },
  //   new Map<string, TransactionReport>()
  // );

  const t3 = performance.now();

  console.log("existingReportsOnDatabase -->", existingReportsOnDatabase);

  console.log(`existingReportsOnDatabase reduce took ${t3 - t2} ms`);

  const newReportsMap = transactionsToTransactionsReport(
    transactionsOnCreate,
    existingReportsOnDatabase
  );

  console.log("newReportsMap -->", newReportsMap);

  const t4 = performance.now();
  console.log(`transactionsToTransactionsReport took ${t4 - t3} ms`);

  // newReportsMap.forEach((report) => {
  //   const currentReportInDatabase = existingReportsOnDatabaseMap.get(report.id);

  //   if (currentReportInDatabase) {
  //     report.transactions = [
  //       ...(currentReportInDatabase.transactions || []),
  //       ...report.transactions,
  //     ];
  //     report.amount = currency(currentReportInDatabase.amount).add(
  //       report.amount
  //     ).value;
  //   }
  // });

  // const reports = new Map();

  /* ------------------------------ MAKE REPORTS ------------------------------ */
  // const monthReports = makeReportsByType("month");
  // const dayReports = makeReportsByType("day");

  // const reports = dayReports.concat(monthReports);

  // reports.forEach(async (transactionReport) => {
  //   const docRef = doc(
  //     firebaseDB,
  //     FirebaseCollection.transactionReports,
  //     transactionReport.id
  //   );

  //   const incrementAmount = increment(transactionReport.amount);
  //   let updatedItem: Omit<TransactionReport, "amount" | "transactions"> & {
  //     amount: any;
  //     transactions: any;
  //   } = {
  //     ...transactionReport,
  //     amount: incrementAmount,
  //     updatedAt: Timestamp.fromDate(now),
  //   };
  //   if (transactionReport.transactions.length > 0) {
  //     updatedItem = {
  //       ...updatedItem,
  //       transactions: arrayUnion(...transactionReport.transactions),
  //     };
  //   }

  //   batch.set(docRef, updatedItem, { merge: true });
  // });

  const t5 = performance.now();

  let finalItems: TransactionReport[] = [];

  newReportsMap.forEach(async (transactionReport) => {
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
    };
    if (transactionReport.transactions.length > 0) {
      updatedItem = {
        ...updatedItem,
        transactions: arrayUnion(...transactionReport.transactions),
      };
    }

    finalItems.push(updatedItem);

    batch.set(docRef, updatedItem, { merge: true });
  });

  const t6 = performance.now();

  console.log(`Bank Insertion took ${t6 - t5} ms`);

  console.log(`batchManyTransactionReports took ${t6 - t1} ms`);

  console.log("finalItems -->", finalItems);
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
