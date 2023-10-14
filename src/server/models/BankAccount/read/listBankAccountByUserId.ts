import { FirebaseCollection } from "@server/firebase";
import { firebaseList } from "@server/firebase/firebaseList";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";
import { BankAccount } from "../schema";
import { z } from "zod";

export const listBankAccountByUserIdSchema = z.object({
  id: z.string(),
});

export type IListBankAccountByUserId = z.infer<
  typeof listBankAccountByUserIdSchema
>;

export type ListBankAccountByUserIdReturnType = AppModelResponse<BankAccount[]>;

export const listBankAccountByUserId = async ({
  id,
}: IListBankAccountByUserId): Promise<ListBankAccountByUserIdReturnType> => {
  const funcName = "listBankAccountByUserId";

  try {
    const list = await firebaseList<BankAccount>({
      collection: FirebaseCollection.bankAccounts,
      filters: [
        { field: "users", operator: "array-contains", value: { id: id } },
      ],
    });
    return {
      data: list,
      done: true,
      error: null,
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
