import { FirebaseCollection } from "@server/firebase";
import { firebaseGet } from "@server/firebase/firebaseGet";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
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
    if (data) {
      return {
        data: data,
        done: true,
        error: null,
      };
    }
    return {
      data: null,
      done: false,
      error: {
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
