import { makeDateFields } from "@/utils/date/makeDateFields";
import { timestampToDate } from "@/utils/date/timestampToDate";
import { Timestamp } from "firebase/firestore";
import { Transaction } from "@/server/models/Transaction/schema";
import { TransactionMin, TransactionReport } from "../schema";
import { makeTransactionReportSlugId } from "./makeTransactionReportSlugId";
import { calculateTransactionsSummary } from "../../../utils/calculateTransactionsSummary";
import currency from "currency.js";

export const makeTransactionReportFields = ({
  transactions,
  type,
  bankAccountId,
}: {
  transactions: Transaction[];
  type: TransactionReport["type"];
  bankAccountId: string;
}): TransactionReport => {
  const now = new Date();
  const nowTimestamp = Timestamp.fromDate(now);

  transactions.sort((a, b) => a.date.seconds - b.date.seconds);

  const refTransaction = transactions[0];

  let date = timestampToDate(refTransaction.date);
  let dateTimestamp = refTransaction.date;

  const transactionMins: TransactionMin[] = transactions.map((transaction) => {
    return {
      amount: transaction.amount,
      id: transaction.id,
      type: transaction.type,
      creditor: transaction.creditor || "",
      creditorSlug: transaction.creditorSlug || "",
    };
  });

  const summary = calculateTransactionsSummary({
    transactions: transactions,
  });

  const totalExpenses = Math.abs(summary.totalExpenses);
  const amount = currency(summary.totalDeposits).subtract(totalExpenses).value;

  const firstTrans = transactions[0];

  const initialBalance = currency(firstTrans.updatedBalance).subtract(
    firstTrans.amount
  ).value;

  const finalBalance = transactions[transactions.length - 1].updatedBalance;

  const newTransactionReport: TransactionReport = {
    id: makeTransactionReportSlugId({
      backAccountId: bankAccountId,
      date: date,
      type,
    }),
    amount: amount,
    initialBalance: initialBalance,
    finalBalance: finalBalance,
    bankAccountId: bankAccountId,
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
    date: dateTimestamp,
    type: type,
    summary: summary,
    transactions: transactionMins,
    ...makeDateFields(date),
  };
  return newTransactionReport;
};
