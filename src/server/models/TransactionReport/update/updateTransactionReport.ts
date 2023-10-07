import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";
import { TransactionReport } from "../schema";

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
