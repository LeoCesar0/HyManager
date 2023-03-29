import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseGet, firebaseList } from "..";
import { BankAccount } from "./schema";

interface IGetBankAccountById {
  id: string;
}

export const getBankAccountById = async ({
  id,
}: IGetBankAccountById): Promise<AppModelResponse<BankAccount>> => {
  const funcName = "getBankAccountById";

  try {
    const result = await firebaseGet<BankAccount>({
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

export const listBankAccountByUserId = async ({
  id,
}: {
  id: string;
}): Promise<AppModelResponse<BankAccount[]>> => {
  const funcName = "listBankAccountByUserId";

  try {
    const result = await firebaseList<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
      filters: [
        { field: "users", operator: "array-contains", value: { id: id } },
      ],
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
