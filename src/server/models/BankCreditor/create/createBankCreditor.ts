import { FirebaseCollection } from "@/server/firebase";
import { BankCreditor, CreateBankCreditor, bankCreditorSchema, createBankCreditorSchema } from "../schema";
import { firebaseCreate } from "@/server/firebase/firebaseCreate";
import { debugDev } from "@/utils/dev";

export type ICreateBankCreditor = {
  values: CreateBankCreditor;
};

export const createBankCreditor = async ({
  values,
}: ICreateBankCreditor) => {
  const funcName = "createBankCreditor";

  try {
    const item = createBankCreditorSchema.parse(values);
    const result = await firebaseCreate<BankCreditor>({
      collection: FirebaseCollection.bankCreditor,
      data: {
        ...item,
        id: `${item.creditorSlug}@@${item.bankAccountId}`
      },
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
