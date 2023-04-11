import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseUpdate } from "..";
import { TransactionReport } from "./schema";

type PartialItem = Partial<TransactionReport>;

interface IUpdateTransactionReport {
  values: PartialItem;
  id: string;
}

export const updateTransactionReport = async ({
  values,
  id,
}: IUpdateTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "updateTransactionReport";

  try {
    delete values.type;
    
    const result = await firebaseUpdate<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      data: values,
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
