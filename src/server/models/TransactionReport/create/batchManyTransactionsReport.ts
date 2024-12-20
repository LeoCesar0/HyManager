import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { Timestamp, WriteBatch } from "firebase/firestore";
import { TransactionReport } from "../schema";
import { createDocRef } from "@/server/utils/createDocRef";
import { makeTransactionReports } from "../utils/makeTransactionReports";

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
  const now = new Date();

  // const allTransactionMonths = transactionsOnCreate.reduce(
  //   (acc, transaction) => {
  //     const month = `${transaction.dateYear}-${transaction.dateMonth}`;
  //     if (!acc.has(month)) {
  //       acc.add(month);
  //     }
  //     return acc;
  //   },
  //   new Set<string>()
  // );

  const reports: TransactionReport[] = makeTransactionReports({
    transactions: transactionsOnCreate,
    bankAccountId,
  });
  // --------------------------
  // BATCH SET
  // --------------------------

  reports.forEach((transactionReport) => {
    const docRef = createDocRef({
      collection: FirebaseCollection.transactionReports,
      id: transactionReport.id,
    });

    transactionReport.updatedAt = Timestamp.fromDate(now);

    batch.set(docRef, transactionReport, { merge: true });
  });
};
