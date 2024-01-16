import { FirebaseCollection } from "@server/firebase";
import { firebaseDelete } from "@server/firebase/firebaseDelete";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";

interface IDeleteTransactionReport {
  id: string;
}

export const deleteTransactionReport = async ({
  id,
}: IDeleteTransactionReport): Promise<AppModelResponse<{ id: string }>> => {
  const funcName = "deleteTransactionReport";
  try {
    await firebaseDelete({
      collection: FirebaseCollection.transactionReports,
      id: id,
    });
    return {
      data: {
        id,
      },
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
