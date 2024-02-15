import { Transaction } from "@/server/models/Transaction/schema";
import currency from "currency.js";
import { TransactionMin, TransactionReport } from "../schema";
import { makeTransactionReportFields } from "./makeTransactionReportFields";


export const transactionsToTransactionsReport = (
  transactionsOnCreate: Transaction[],
  existingReportsOnDatabase: TransactionReport[]
) => {
  const transactionsAlreadyIncluded: Set<string> = new Set();

  // console.log('// Enter transactionsToTransactionsReport //')

  // console.log('transactionsOnCreate -->', transactionsOnCreate)
  // console.log('existingReportsOnDatabase -->', existingReportsOnDatabase)

  const existingReportsOnDatabaseMap = existingReportsOnDatabase.reduce(
    (acc, entry) => {
      acc.set(entry.id, entry);
      return acc;
    },
    new Map<string, TransactionReport>()
  );

  // const reportsAlreadyUpdatedWithDatabase: Set<string> = new Set();

  const newReportsMap: Map<string, TransactionReport> =
    transactionsOnCreate.reduce((acc, transaction) => {
      const types: TransactionReport["type"][] = ["month", "day"];

      // console.log('Analysing transaction -->', transaction)

      if (transactionsAlreadyIncluded.has(transaction.id)) {
        // console.log('Skipping transaction already included')
        return acc
      };

      transactionsAlreadyIncluded.add(transaction.id);

      // console.log('Transaction not included Yet')

      types.forEach((type) => {
        // MAKE REPORT FIELDS FOR A SINGLE TRANSACTION
        // console.log('--> Enter type', type)

        const transactionReport = makeTransactionReportFields(
          transaction,
          type
        );


        const currentReportInDatabase = existingReportsOnDatabaseMap.get(
          transactionReport.id
        );

        const currentReportInAcc = acc.get(transactionReport.id);

        // console.log('currentReportInAcc ?', !!currentReportInAcc)
        // console.log('currentReportInAcc -->', currentReportInAcc)
        
        // IF TRANSACTION REPORT DOES NOT EXISTS IN ACC
        if (!currentReportInAcc) {
          const currentTransactionWasNotIncludedInExistingReport =
            currentReportInDatabase &&
            !currentReportInDatabase.transactions.some(
              (item) => item.id === transaction.id
            );

          if (currentReportInDatabase) {
            // console.log('Adding previous amount and transactions')
            // Updated with value in database
            transactionReport.amount = currency(
              currentReportInDatabase.amount
            ).add(transactionReport.amount).value;


            transactionReport.transactions.push(...currentReportInDatabase.transactions)
          }

          if (
            !currentReportInDatabase ||
            currentTransactionWasNotIncludedInExistingReport
          ) {
            // console.log('transactionReport added to ACC -->', transactionReport)
            acc.set(transactionReport.id, transactionReport);
          }
        }
        if (currentReportInAcc) {

          const updatedAmount = currency(currentReportInAcc.amount).add(
            transaction.amount
          ).value;
          const transactionMin: TransactionMin = {
            amount: transaction.amount,
            id: transaction.id,
            type: transaction.type,
            creditor: transaction.creditor || "",
            creditorSlug: transaction.creditor || "",
          };
          const existingTransactionsInAcc = currentReportInAcc.transactions;
          const thisTransactionWasAlreadyIncluded =
            existingTransactionsInAcc.some(
              (item) => item.id === transactionMin.id
            );
            // console.log('thisTransactionWasAlreadyIncluded -->', thisTransactionWasAlreadyIncluded)
          if (!thisTransactionWasAlreadyIncluded) {
            const item = {
              ...currentReportInAcc,
              amount: updatedAmount,
              transactions: [...existingTransactionsInAcc, transactionMin],
            }
            // console.log('transactionReport added to ACC -->', item)
            acc.set(transactionReport.id, item);
          }
        }

        // console.log('// CLOSE THIS TRANSACTION REPORT //')
      });

      return acc;
    }, new Map<string, TransactionReport>());

    // console.log('Final newReportsMap -->', newReportsMap)

  // return Array.from(newReportsMap.values());
  return newReportsMap;
};
