import { FirebaseCollection } from "@server/firebase";
import { firebaseGet } from "@server/firebase/firebaseGet";
import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { TransactionReport } from "../schema";

interface IGetTransactionReportById {
  id: string;
}

export const getTransactionReportById = async ({
  id,
}: IGetTransactionReportById): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "getTransactionReportById";

  try {
    const data = await firebaseGet<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      id: id,
    });
    return {
      data: data || null,
      done: !!data,
      error: data
        ? null
        : {
            message: debugDev({
              type: "error",
              name: funcName,
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