import { AppModelResponse, FirebaseFilterFor } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseGet, firebaseList } from "..";
import { TransactionReport } from "./schema";

interface IGetTransactionReportById {
  id: string;
}

export const getTransactionReportById = async ({
  id,
}: IGetTransactionReportById): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "getTransactionReportById";

  try {
    const result = await firebaseGet<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      id: id,
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

interface IListTransactionReport {
  bankAccountId: string;
  type: string;
  filters?: FirebaseFilterFor<TransactionReport>[];
}
export const listTransactionReportsBy = async ({
  bankAccountId,
  type,
  filters = [],
}: IListTransactionReport): Promise<AppModelResponse<TransactionReport[]>> => {
  const funcName = "listTransactionReportsBy";

  try {
    const result = await firebaseList<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      filters: [
        { field: "bankAccountId", operator: "==", value: bankAccountId },
        { field: "type", operator: "==", value: type },
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
