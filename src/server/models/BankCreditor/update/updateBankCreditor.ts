import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { BankCreditor } from "../schema";

interface IUpdateBankCreditor {
  values: {
    categorySlug: BankCreditor["categorySlug"];
  };
  id: string;
}

export const updateBankCreditor = async ({
  values,
  id,
}: IUpdateBankCreditor): Promise<AppModelResponse<BankCreditor>> => {
  const funcName = "updateBankCreditor";
  try {
    const result = await firebaseUpdate<BankCreditor>({
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
