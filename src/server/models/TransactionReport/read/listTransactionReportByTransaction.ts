import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { firebaseList } from "@server/firebase/firebaseList";
import { debugDev } from "@/utils/dev";
import { TransactionReport } from "../schema";
import { FirebaseFilterFor } from "@/@types";

type ListTransactionReportByTransactionProps = {
  transaction: Transaction;
  type?: TransactionReport["type"];
};

export const listTransactionReportByTransaction = async ({
  transaction,
  type,
}: ListTransactionReportByTransactionProps) => {
  const funcName = "listTransactionReportByTransaction";

  const filters: FirebaseFilterFor<TransactionReport>[] = [
    { field: "dateMonth", operator: "==", value: transaction.dateMonth },
    { field: "dateYear", operator: "==", value: transaction.dateYear },
    {
      field: "bankAccountId",
      operator: "==",
      value: transaction.bankAccountId,
    },
  ];

  if (type && !filters.find((filter) => filter.field === "type")) {
    filters.push({ field: "type", operator: "==", value: type });
  }

  try {
    const list = await firebaseList<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      filters: filters,
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
