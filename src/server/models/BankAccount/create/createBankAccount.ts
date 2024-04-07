import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";
import { firebaseCreate } from "@server/firebase/firebaseCreate";
import { FirebaseCollection } from "@server/firebase";
import { BankAccount, CreateBankAccount } from "../schema";
import { DEFAULT_CATEGORIES } from "../static";

interface ICreateBankAccount {
  values: CreateBankAccount;
}

export const createBankAccount = async ({
  values,
}: ICreateBankAccount): Promise<AppModelResponse<BankAccount>> => {
  const funcName = "createBankAccount";
  const item: BankAccount = {
    ...values,
    id: uuid(),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    balance: 0,
  };
  if (!item.categories) {
    item.categories = DEFAULT_CATEGORIES.map((item) => {
      return {
        ...item,
        name: item.name.pt,
      };
    });
  }
  try {
    const result = await firebaseCreate<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
      data: item,
    });
    if (result) {
      return {
        data: result,
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
