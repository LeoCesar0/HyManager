import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";
import { TransactionReport, transactionReportSchema } from "../schema";
import { firebaseCreate } from "@server/firebase/firebaseCreate";
import { FirebaseCollection } from "@server/firebase";
import { makeTransactionReportSlugId } from "../utils/makeTransactionReportSlugId";

interface ICreateTransactionReport {
  transactionReport: TransactionReport;
}

export const createTransactionReport = async ({
  transactionReport,
}: ICreateTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "createTransactionReport";

  try {
    const id = makeTransactionReportSlugId({
      backAccountId: transactionReport.bankAccountId,
      date: transactionReport.date.toDate(),
      type: transactionReport.type,
    });

    const data: TransactionReport = {
      ...transactionReport,
      id,
    };

    transactionReportSchema.parse(data);

    const result = await firebaseCreate<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      data: data,
    });
    return {
      done: !!result,
      data: result || null,
      error: result
        ? null
        : {
            message: debugDev({
              name: funcName,
              type: "error",
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
