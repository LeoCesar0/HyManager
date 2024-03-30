import { CategoryByCreditor } from "../schema";
import { FirebaseCollection } from "@/server/firebase";
import { firebaseGetWhere } from "@/server/firebase/firebaseGetWhere";
import { debugDev } from "@/utils/dev";

export type IGetCategoryByCreditor = {
  creditorSlug: string;
  bankAccountId: string;
};

export const getCategoryByCreditor = async ({
  creditorSlug,
  bankAccountId,
}: IGetCategoryByCreditor) => {
  const funcName = "getCategoryByCreditor";

  try {
    if (!bankAccountId) {
      throw new Error("Bank Account Id is required");
    }
    if (!creditorSlug) {
      throw new Error("CreditorSlug is required");
    }

    const data = await firebaseGetWhere<CategoryByCreditor>({
      collection: FirebaseCollection.categoryByCreditor,
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
