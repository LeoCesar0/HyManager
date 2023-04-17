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
