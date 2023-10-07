import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";
import { firebaseCreate } from "@server/firebase/firebaseCreate";
import { FirebaseCollection } from "@server/firebase";
import { BankAccount, CreateBankAccount } from "../schema";

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
    return {
      data: result || null,
      done: !!result,
      error: result
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
