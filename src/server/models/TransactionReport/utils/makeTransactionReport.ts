import { AppModelResponse } from "@types-folder/index";
import currency from "currency.js";
import { debugDev } from "src/utils/dev";
import { Transaction } from "../../Transaction/schema";
import { createTransactionReport } from "../create";
import { listTransactionReportByTransaction } from "../read";
import { TransactionReport } from "../schema";
import { updateTransactionReport } from "../update";

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
