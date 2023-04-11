import { AppModelResponse } from "@types-folder/index";
import currency from "currency.js";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseList } from "..";
import { createTransactionReport } from "../TransactionReport/create";
import { TransactionReport } from "../TransactionReport/schema";
import { updateTransactionReport } from "../TransactionReport/update";
import { Transaction } from "./schema";

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
    const listResult = await firebaseList<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      filters: [
        { field: "type", operator: "==", value: type },
        { field: "dateMonth", operator: "==", value: transaction.dateMonth },
        { field: "dateYear", operator: "==", value: transaction.dateYear },
        {
          field: "bankAccountId",
          operator: "==",
          value: transaction.bankAccountId,
        },
      ],
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
