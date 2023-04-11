import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseDelete, firebaseUpdate } from "..";

interface IDeleteBankAccount {
  id: string;
}

export const deleteBankAccount = async ({
  id,
}: IDeleteBankAccount): Promise<AppModelResponse<{ id: string }>> => {
  const funcName = "deleteBankAccount";
  try {
    const result = await firebaseDelete({
      collection: FirebaseCollection.bankAccounts,
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