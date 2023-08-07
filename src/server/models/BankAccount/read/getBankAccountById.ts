import { FirebaseCollection } from "@server/firebase";
import { firebaseGet } from "@server/firebase/firebaseGet";
import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { BankAccount } from "../schema";

interface IGetBankAccountById {
  id: string;
}

export const getBankAccountById = async ({
  id,
}: IGetBankAccountById): Promise<AppModelResponse<BankAccount>> => {
  const funcName = "getBankAccountById";

  try {
    const data = await firebaseGet<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
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