import { BankCreditor } from "../schema";
import { FirebaseCollection } from "@/server/firebase";
import { firebaseGetWhere } from "@/server/firebase/firebaseGetWhere";
import { debugDev } from "@/utils/dev";

export type IGetBankCreditor = {
  creditorSlug: string;
  bankAccountId: string;
};

export const getBankCreditor = async ({
  creditorSlug,
  bankAccountId,
}: IGetBankCreditor) => {
  const funcName = "getBankCreditor";

  try {
    if (!bankAccountId) {
      throw new Error("Bank Account Id is required");
    }
    if (!creditorSlug) {
      throw new Error("CreditorSlug is required");
    }

    const data = await firebaseGetWhere<BankCreditor>({
      collection: FirebaseCollection.bankCreditor,
      filters: [
        {
          field: "creditorSlug",
          operator: "==",
          value: creditorSlug,
        },
        {
            field: "bankAccountId",
            operator: "==",
            value: bankAccountId,
          },
      ],
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
