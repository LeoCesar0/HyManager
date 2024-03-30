import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { CategoryByCreditor } from "../schema";

interface IUpdateCategoryByCreditor {
  values: {
    categorySlug: CategoryByCreditor["categorySlug"];
  };
  id: string;
}

export const updateCategoryByCreditor = async ({
  values,
  id,
}: IUpdateCategoryByCreditor): Promise<AppModelResponse<CategoryByCreditor>> => {
  const funcName = "updateCategoryByCreditor";
  try {
    const result = await firebaseUpdate<CategoryByCreditor>({
      collection: FirebaseCollection.categoryByCreditor,
      data: values,
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
