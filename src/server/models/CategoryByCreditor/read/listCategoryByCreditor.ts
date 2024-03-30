import { CategoryByCreditor } from "../schema";
import { FirebaseCollection } from "@/server/firebase";
import { firebaseList } from "@/server/firebase/firebaseList";
import { debugDev } from "@/utils/dev";

export type IListCategoryByCreditor = {
  bankAccountId: string;
};

export const listCategoryByCreditor = async ({
  bankAccountId,
}: IListCategoryByCreditor) => {
  const funcName = "listCategoryByCreditor";

  try {
    if (!bankAccountId) {
      throw new Error("Bank Account Id is required");
    }
    const data = await firebaseList<CategoryByCreditor>({
      collection: FirebaseCollection.categoryByCreditor,
      filters: [
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
