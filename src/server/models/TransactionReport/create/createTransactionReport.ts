import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { TransactionReport, transactionReportSchema } from "../schema";
import { Transaction } from "../../Transaction/schema";
import { makeTransactionReportFields } from "../utils/makeTransactionReportFields";

import { firebaseCreate } from "@server/firebase/firebaseCreate";
import { FirebaseCollection } from "@server/firebase";

interface ICreateTransactionReport {
  transaction: Transaction;
  type: TransactionReport["type"];
}

export const createTransactionReport = async ({
  transaction,
  type,
}: ICreateTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "createTransactionReport";

  try {
    const newTransactionReport = makeTransactionReportFields(transaction, type);

    transactionReportSchema.parse(newTransactionReport);

    const result = await firebaseCreate<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      data: newTransactionReport,
    });
    return {
      done: !!result,
      data: result || null,
      error: result ? null : {
        message: debugDev({
          name: funcName,
          type: 'error',
          value: 'Error'
        })
      }
    };
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
