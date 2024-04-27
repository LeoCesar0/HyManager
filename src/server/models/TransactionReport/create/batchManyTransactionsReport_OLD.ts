import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { Timestamp, WriteBatch } from "firebase/firestore";
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
  const now = new Date();

  const listResults = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
  });

  const existingReportsOnDatabase = listResults.data || [];

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

    transactionReport.updatedAt = Timestamp.fromDate(now);

    finalItems.push(transactionReport);

    batch.set(docRef, transactionReport, { merge: true });
  });
};
