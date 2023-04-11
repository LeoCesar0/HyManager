import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseDelete } from "..";

interface IDeleteTransactionReport {
  id: string;
}

export const deleteTransactionReport = async ({
  id,
}: IDeleteTransactionReport): Promise<AppModelResponse<{ id: string }>> => {
  const funcName = "deleteTransactionReport";
  try {
    const result = await firebaseDelete({
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
