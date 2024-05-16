import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { BankCreditor } from "../schema";
import { ALGOLIA_CLIENT, ALGOLIA_INDEXES } from "@/services/algolia";

interface IUpdateBankCreditor {
  values: {
    categoryId: BankCreditor["categoryId"];
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
      collection: FirebaseCollection.bankCreditors,
      data: values,
      id: id,
    });
    if (result.done) {
      const client = ALGOLIA_CLIENT();
      const index = client.initIndex(ALGOLIA_INDEXES.CREDITORS);
      index.partialUpdateObject(
        {
          objectID: id,
          ...values,
        },
        {
          createIfNotExists: true,
        }
      );
    }
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
