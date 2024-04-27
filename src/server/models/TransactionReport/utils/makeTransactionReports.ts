import { timestampToDate } from "@/utils/date/timestampToDate";
import { Transaction } from "../../Transaction/schema";
import { TransactionReport } from "../schema";
import { makeTransactionReportFields } from "./makeTransactionReportFields";
import { makeDateFields } from "@/utils/date/makeDateFields";

export const makeTransactionReports = ({
  transactions,
  bankAccountId,
}: {
  transactions: Transaction[];
  bankAccountId: string;
}) => {
  const reports: TransactionReport[] = [];

  const transactionsByDay = new Map<string, Transaction[]>();
  const transactionsByMonth = new Map<string, Transaction[]>();

  transactions.forEach((transaction) => {
    const date = timestampToDate(transaction.date);
    const dateParams = makeDateFields(date);

    // --------------------------
    // GROUP BY MONTH
    // --------------------------
    {
      const dateSlug = `${dateParams.dateYear}-${dateParams.dateMonth}`;
      const prev = transactionsByDay.get(dateSlug) || [];

      transactionsByMonth.set(dateSlug, prev.concat(transaction));
    }

    // --------------------------
    // GROUP BY DAY
    // --------------------------
    {
      const dateSlug = `${dateParams.dateYear}-${dateParams.dateMonth}-${dateParams.dateDay}`;
      const prev = transactionsByDay.get(dateSlug) || [];
      transactionsByDay.set(dateSlug, prev.concat(transaction));
    }
  });

  // --------------------------
  // transactionsByDay
  // --------------------------

  transactionsByDay.forEach((transactions) => {
    const transactionReport: TransactionReport = makeTransactionReportFields({
      transactions,
      type: "day",
      bankAccountId,
    });

    reports.push(transactionReport);
  });

  // --------------------------
  // transactionsByMonth
  // --------------------------

  transactionsByMonth.forEach((transactions) => {
    const transactionReport: TransactionReport = makeTransactionReportFields({
      transactions,
      type: "month",
      bankAccountId,
    });

    reports.push(transactionReport);
  });

  return reports;
};
