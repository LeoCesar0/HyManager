import { FirebaseCollection } from "@server/firebase";
import { firebaseList } from "@server/firebase/firebaseList";
import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { BankAccount } from "../schema";

export const listBankAccountByUserId = async ({
  id,
}: {
  id: string;
}): Promise<AppModelResponse<BankAccount[]>> => {
  const funcName = "listBankAccountByUserId";

  try {
    const list = await firebaseList<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
      filters: [
        { field: "users", operator: "array-contains", value: { id: id } },
      ],
    });
    return {
      data: list,
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
