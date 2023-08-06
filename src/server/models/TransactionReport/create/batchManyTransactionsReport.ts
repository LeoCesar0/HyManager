import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { doc, Timestamp, WriteBatch } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { listTransactionReportsBy } from "../read";
import { TransactionReport } from "../schema";
import calculateAccountBalance from "../utils/calculateAccountBalance";
import { transactionsToTransactionsReport } from "../utils/transactionToTransactionsReport";

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
  
    const newReportsMap = transactionsToTransactionsReport(
      transactionsOnCreate,
      existingReportsOnDatabase
    );
  
    console.log("newReportsMap -->", newReportsMap);
  
    const t4 = performance.now();
    console.log(`transactionsToTransactionsReport took ${t4 - t3} ms`);
  
    const tA = performance.now()
  
    const reports = calculateAccountBalance({
      existingReports: existingReportsOnDatabase,
      newReportsMap: newReportsMap,
    });
  
    const tB = performance.now()
  
    console.log(`calculateAccountBalance took ${tB - tA} ms`);
  
    const t5 = performance.now();
  
    let finalItems: TransactionReport[] = [];
  
    console.log('All reports to batch -->', reports)
  
    reports.forEach((transactionReport) => {
      const docRef = doc(
        firebaseDB,
        FirebaseCollection.transactionReports,
        transactionReport.id
      );
  
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
      transactionReport.updatedAt = Timestamp.fromDate(now)
  
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
  
    const t6 = performance.now();
  
    console.log(`Bank Insertion took ${t6 - t5} ms`);
  
    console.log(`batchManyTransactionReports took ${t6 - t1} ms`);
  
    console.log("FINAL ITEMS -->", finalItems);
    console.log('---------------------------------------')
  };