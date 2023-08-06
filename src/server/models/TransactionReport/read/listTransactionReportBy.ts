import { FirebaseCollection } from "@server/firebase";
import { firebaseList } from "@server/firebase/firebaseList";
import { AppModelResponse, FirebaseFilterFor } from "@types-folder";
import { debugDev } from "src/utils/dev";
import { TransactionReport } from "../schema";

interface IListTransactionReport {
    bankAccountId: string;
    type?: TransactionReport["type"];
    filters?: FirebaseFilterFor<TransactionReport>[];
  }
  export const listTransactionReportsBy = async ({
    bankAccountId,
    type,
    filters = [],
  }: IListTransactionReport): Promise<AppModelResponse<TransactionReport[]>> => {
    const funcName = "listTransactionReportsBy";
  
    if (type) {
      filters.push({ field: "type", operator: "==", value: type });
    }
  
    try {
      const result = await firebaseList<TransactionReport>({
        collection: FirebaseCollection.transactionReports,
        filters: [
          { field: "bankAccountId", operator: "==", value: bankAccountId },
          ...filters,
        ],
      });
      return result;
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