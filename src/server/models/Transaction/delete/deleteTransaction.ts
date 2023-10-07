import { FirebaseCollection } from "@server/firebase";
import { firebaseDelete } from "@server/firebase/firebaseDelete";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";

interface IDeleteTransaction {
  id: string;
}

export const deleteTransaction = async ({
  id,
}: IDeleteTransaction): Promise<AppModelResponse<{ id: string }>> => {
  const funcName = "deleteTransaction";
  try {
    await firebaseDelete({
      collection: FirebaseCollection.transactions,
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
