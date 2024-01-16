import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { firebaseList } from "@server/firebase/firebaseList";
import { debugDev } from "@/utils/dev";
import { TransactionReport } from "../schema";

export const listTransactionReportByTransaction = async ({
  transaction,
  type,
}: {
  transaction: Transaction;
  type: TransactionReport["type"];
}) => {
  const funcName = "listTransactionReportByTransaction";

  try {
    const list = await firebaseList<TransactionReport>({
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
    return {
      data: list,
      done: true,
      error: null,
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
