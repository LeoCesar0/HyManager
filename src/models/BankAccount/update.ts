import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseUpdate } from "..";
import { BankAccount } from "./schema";

type PartialItem = Partial<BankAccount>

interface IUpdateBankAccount {
  values: PartialItem;
  id: string
}

export const updateBankAccount = async ({
  values,
  id
}: IUpdateBankAccount): Promise<AppModelResponse<BankAccount>> => {
  const funcName = "updateBankAccount";
  try {
    const result = await firebaseUpdate<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
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
