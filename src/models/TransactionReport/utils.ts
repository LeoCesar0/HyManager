import { AppModelResponse } from "@types-folder/index";
import currency from "currency.js";
import { Timestamp } from "firebase/firestore";
import { makeDateFields } from "src/utils/app";
import { debugDev } from "src/utils/dev";
import { timestampToDate } from "src/utils/misc";
import { Transaction } from "../Transaction/schema";
import { createTransactionReport } from "../TransactionReport/create";
import { listTransactionReportByTransaction } from "../TransactionReport/read";
import { TransactionMin, TransactionReport } from "../TransactionReport/schema";
import { updateTransactionReport } from "../TransactionReport/update";

interface IMakeTransactionReport {
  type?: TransactionReport["type"];
  transaction: Transaction;
}

export const makeTransactionReport = async ({
  type = "month",
  transaction,
}: IMakeTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "makeTransactionReport";
  //TODO refactor delete
  try {
    const listResult = await listTransactionReportByTransaction({
      transaction,
      type,
    });

    const existingMonthlyReport = (listResult.data || [])[0];
    /* ---------------------------- UPDATE IF EXISTS ---------------------------- */
    if (existingMonthlyReport) {
      const updatedCurrency = currency(transaction.amount).add(
        existingMonthlyReport.amount
      );
      const updatedMonthlyReport: typeof existingMonthlyReport = {
        ...existingMonthlyReport,
        amount: updatedCurrency.value,
      };
      await updateTransactionReport({
        id: updatedMonthlyReport.id,
        values: updatedMonthlyReport,
      });

      return {
        done: true,
        data: updatedMonthlyReport,
        error: null,
      };
    } else {
      /* -------------------------- CREATE IF NOT EXISTS -------------------------- */
      const createResults = await createTransactionReport({
        transaction: transaction,
        type: type,
      });
      return createResults;
    }
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

export const makeTransactionReportSlugId = ({
  date,
  backAccountId,
  type,
}: {
  backAccountId: string;
  date: Date;
  type: TransactionReport["type"];
}) => {
  const dateParams = makeDateFields(date);
  let string = `${dateParams.dateYear}-${dateParams.dateMonth}`;
  if (type === "day") string += `-${dateParams.dateDay}`;
  string += `##${backAccountId}`;
  return string;
};

export const makeTransactionReportFields = (
  transaction: Transaction,
  type: TransactionReport["type"]
): TransactionReport => {
  const now = new Date();
  const nowTimestamp = Timestamp.fromDate(now);

  let date = timestampToDate(transaction.date); // if type === day
  let dateTimestamp = transaction.date;

  const transactionMin: TransactionMin = {
    amount: transaction.amount,
    id: transaction.id,
    type: transaction.type,
    creditor: transaction.creditor || "",
    creditorSlug: transaction.creditorSlug || "",
  };

  const newTransactionReport: TransactionReport = {
    id: makeTransactionReportSlugId({
      backAccountId: transaction.bankAccountId,
      date: date,
      type,
    }),
    amount: transaction.amount,
    bankAccountId: transaction.bankAccountId,
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
    date: dateTimestamp,
    type: type,
    transactions: [transactionMin],
    ...makeDateFields(date),
  };
  return newTransactionReport;
};

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

  // const reportsAlreadyUpdatedWithDatabase: Set<string> = new Set();

  const newReportsMap: Map<string, TransactionReport> =
    transactionsOnCreate.reduce((acc, transaction) => {
      const types: TransactionReport["type"][] = ["month", "day"];

      if (transactionsAlreadyIncluded.has(transaction.id)) return acc;
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

        // if (
        //   currentReportInDatabase &&
        //   !reportsAlreadyUpdatedWithDatabase.has(transactionReport.id)
        // ) {
        //   transactionReport.transactions = [
        //     ...(currentReportInDatabase.transactions || []),
        //     ...transactionReport.transactions,
        //   ];
        //   transactionReport.amount = currency(transactionReport.amount).add(
        //     transaction.amount
        //   ).value;
        // }

        // FIELD OF AN EXISTING REPORT OR -1
        // const indexOfExistingReportInAcc = acc.findIndex(
        //   (item) => item.id === transactionReport.id
        // );
        // const transactionReportExistsInAcc = indexOfExistingReportInAcc >= 0;
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
          }

          if (
            !currentReportInDatabase ||
            currentTransactionWasNotIncludedInExistingReport
          ) {
            acc.set(transactionReport.id, transactionReport);
            // acc.push(transactionReport);
          }
        }
        if (currentReportInAcc) {
          // const reportsInAcc = acc[indexOfExistingReportInAcc];

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
          if (!thisTransactionWasAlreadyIncluded) {
            acc.set(transactionReport.id, {
              ...currentReportInAcc,
              amount: updatedAmount,
              transactions: [...existingTransactionsInAcc, transactionMin],
            });
            // acc.splice(indexOfExistingReportInAcc, 1, {
            //   ...reportsInAcc,
            //   amount: updatedAmount,
            //   transactions: [...existingTransactionsInAcc, transactionMin],
            // });
          }
        }
      });

      return acc;
    }, new Map<string, TransactionReport>());

  // return Array.from(newReportsMap.values());
  return newReportsMap;
};
