import { Transaction } from "@/server/models/Transaction/schema";
import { calculateTransactionsSummary } from "@/server/utils/calculateTransactionsSummary";
import currency from "currency.js";
import { TransactionMin, TransactionReport } from "../schema";
import { makeTransactionReportFields } from "./makeTransactionReportFields";


export const transactionsToTransactionsReport = (
  transactionsOnCreate: Transaction[],
  existingReportsOnDatabase: TransactionReport[]
) => {
  const transactionsAlreadyIncluded: Set<string> = new Set();

  const existingReportsOnDatabaseMap = existingReportsOnDatabase.reduce(
    (acc, entry) => {
      acc.set(entry.id, entry);
      return acc;
    },
    new Map<string, TransactionReport>()
  );

  const newReportsMap: Map<string, TransactionReport> =
    transactionsOnCreate.reduce((acc, transaction) => {
      const types: TransactionReport["type"][] = ["month", "day"];

      if (transactionsAlreadyIncluded.has(transaction.id)) {
        // console.log('Skipping transaction already included')
        return acc
      };

      transactionsAlreadyIncluded.add(transaction.id);

      types.forEach((type) => {
        // MAKE REPORT FIELDS FOR A SINGLE TRANSACTION
        const transactionReport = makeTransactionReportFields(
          transaction,
          type
        );

        const currentReportInDatabase = existingReportsOnDatabaseMap.get(
          transactionReport.id
        );

        const currentReportInAcc = acc.get(transactionReport.id);

        // IF TRANSACTION REPORT DOES NOT EXISTS IN ACC
        if (!currentReportInAcc) {
          const currentTransactionWasNotIncludedInExistingReport =
            currentReportInDatabase &&
            !currentReportInDatabase.transactions.some(
              (item) => item.id === transaction.id
            );

          if (currentReportInDatabase) {
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
            const transactions = [...existingTransactionsInAcc, transactionMin]
            const item = {
              ...currentReportInAcc,
              amount: updatedAmount,
              transactions: transactions,
              summary: calculateTransactionsSummary({
                transactions: transactions
              }),
            }
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
