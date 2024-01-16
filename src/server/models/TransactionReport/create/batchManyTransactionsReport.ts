import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { doc, Timestamp, WriteBatch } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { listTransactionReportsBy } from "../read/listTransactionReportBy";
import { TransactionReport } from "../schema";
import calculateAccountBalance from "../utils/calculateAccountBalance";
import { transactionsToTransactionsReport } from "../utils/transactionToTransactionsReport";
import { createDocRef } from "@/server/utils/createDocRef";

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

  // const existingReportsOnDatabaseMap = existingReportsOnDatabase.reduce(
  //   (acc, entry) => {
  //     acc.set(entry.id, entry);
  //     return acc;
  //   },
  //   new Map<string, TransactionReport>()
  // );

  const newReportsMap = transactionsToTransactionsReport(
    transactionsOnCreate,
    existingReportsOnDatabase
  );

  const reports = calculateAccountBalance({
    existingReports: existingReportsOnDatabase,
    newReportsMap: newReportsMap,
  });

  let finalItems: TransactionReport[] = [];

  reports.forEach((transactionReport) => {
    const docRef = createDocRef({
      collection: FirebaseCollection.transactionReports,
      id: transactionReport.id,
    });

    // let updatedItem: Omit<TransactionReport, "amount" | "transactions"> & {
    //   amount: any;
    //   transactions: any;
    // } = {
    //   ...transactionReport,
    //   updatedAt: Timestamp.fromDate(now),
    // };
    // if (transactionReport.transactions.length > 0) {
    //   updatedItem = {
    //     ...updatedItem,
    //     transactions: arrayUnion(...transactionReport.transactions),
    //   };
    // }
    transactionReport.updatedAt = Timestamp.fromDate(now);

    finalItems.push(transactionReport);

    batch.set(docRef, transactionReport, { merge: true });
  });

  // newReportsMap.forEach(async (transactionReport) => {
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

  //   finalItems.push(updatedItem);

  //   batch.set(docRef, updatedItem, { merge: true });
  // });
};
