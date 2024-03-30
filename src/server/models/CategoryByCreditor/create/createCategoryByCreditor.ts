import { FirebaseCollection } from "@/server/firebase";
import { CategoryByCreditor, CreateCategoryByCreditor, categoryByCreditorSchema, createCategoryByCreditorSchema } from "../schema";
import { firebaseCreate } from "@/server/firebase/firebaseCreate";
import { debugDev } from "@/utils/dev";

export type ICreateCategoryByCreditor = {
  values: CreateCategoryByCreditor;
};

export const createCategoryByCreditor = async ({
  values,
}: ICreateCategoryByCreditor) => {
  const funcName = "createCategoryByCreditor";

  try {
    const item = createCategoryByCreditorSchema.parse(values);
    const result = await firebaseCreate<CategoryByCreditor>({
      collection: FirebaseCollection.categoryByCreditor,
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
