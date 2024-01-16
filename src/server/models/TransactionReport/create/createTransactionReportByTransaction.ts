import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { TransactionReport, transactionReportSchema } from "../schema";
import { Transaction } from "../../Transaction/schema";
import { makeTransactionReportFields } from "../utils/makeTransactionReportFields";

import { firebaseCreate } from "@server/firebase/firebaseCreate";
import { FirebaseCollection } from "@server/firebase";

interface ICreateTransactionReportByTransaction {
  transaction: Transaction;
  type: TransactionReport["type"];
}

export const createTransactionReportByTransaction = async ({
  transaction,
  type,
}: ICreateTransactionReportByTransaction): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "createTransactionReportByTransaction";

  try {
    const newTransactionReport = makeTransactionReportFields(transaction, type);

    transactionReportSchema.parse(newTransactionReport);

    const data = await firebaseCreate<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      data: newTransactionReport,
    });
    if (data) {
      return {
        data: data,
        done: true,
        error: null,
      };
    }
    return {
      data: null,
      done: false,
      error: {
        message: debugDev({
          type: "error",
          name: funcName,
          value: "Error",
        }),
      },
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
