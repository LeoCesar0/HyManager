import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import {
  BankAccount,
  UpdateBankAccount,
  updateBankAccountSchema,
} from "../schema";

interface IUpdateBankAccount {
  values: UpdateBankAccount;
  id: string;
}

export const updateBankAccount = async ({
  values,
  id,
}: IUpdateBankAccount): Promise<AppModelResponse<BankAccount>> => {
  const funcName = "updateBankAccount";
  try {
    const parsedValues = updateBankAccountSchema.parse(values);

    const result = await firebaseUpdate<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
      data: parsedValues,
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
