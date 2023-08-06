import { Transaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { firebaseList } from "@server/firebase/firebaseList";
import { AppModelResponse, FirebaseFilterFor } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { TransactionReport } from "../schema";

export const listTransactionReportByTransaction = async ({
  transaction,
  type,
}: {
  transaction: Transaction;
  type: TransactionReport["type"];
}) => {
  return await firebaseList<TransactionReport>({
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
};
