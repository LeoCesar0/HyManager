import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { CreateBankAccount, BankAccount } from "./schema";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";

interface ICreateBankAccount {
  values: CreateBankAccount;
}

export const createBankAccount = async ({
  values,
}: ICreateBankAccount): Promise<AppModelResponse<BankAccount>> => {
  const funcName = "getBankAccountById";
  const item: BankAccount = {
    ...values,
    id: uuid(),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  };
  try {
    const result = await firebaseCreate<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
      data: item,
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
