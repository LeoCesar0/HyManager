import { makeDateFields } from "@/utils/date/makeDateFields";
import { timestampToDate } from "@/utils/date/timestampToDate";
import { Timestamp } from "firebase/firestore";
import { Transaction } from "@/server/models/Transaction/schema";
import { TransactionMin, TransactionReport } from "../schema";
import { makeTransactionReportSlugId } from "./makeTransactionReportSlugId";
import { calculateTransactionsSummary } from '../../../utils/calculateTransactionsSummary';

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
    finalBalance: transaction.amount,
    initialBalance: 0,
    bankAccountId: transaction.bankAccountId,
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
    date: dateTimestamp,
    type: type,
    summary: calculateTransactionsSummary({
      transactions: [transaction]
    }),
    transactions: [transactionMin],
    ...makeDateFields(date),
  };
  return newTransactionReport;
};
