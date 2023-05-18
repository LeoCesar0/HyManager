import { Timestamp } from "firebase/firestore";
import { Transaction } from "src/models/Transaction/schema";
import { makeDateFields } from "src/utils/app";
import { timestampToDate } from "src/utils/misc";
import { TransactionMin, TransactionReport } from "../schema";
import { makeTransactionReportSlugId } from "./makeTransactionReportSlugId";

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
    accountBalance: transaction.amount,
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