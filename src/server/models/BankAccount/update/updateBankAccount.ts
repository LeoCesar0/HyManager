import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { BankAccount } from "../schema";
import { DEFAULT_CATEGORIES } from "../static";

type PartialItem = Partial<BankAccount>;

interface IUpdateBankAccount {
  values: PartialItem;
  id: string;
}

export const updateBankAccount = async ({
  values,
  id,
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
