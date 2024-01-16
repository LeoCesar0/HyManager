import {
  AppModelResponse,
  FirebaseFilterFor,
  Pagination,
} from "@/@types/index";
import { FirebaseCollection } from "@/server/firebase";
import { firebaseList } from "@/server/firebase/firebaseList";
import { debugDev } from "@/utils/dev";
import { Transaction } from "../schema";
import { firebasePaginatedList } from "../../../firebase/firebasePaginatedList";
import { PaginationResult } from "../../../../@types/index";

interface IListTransactionByBankId {
  id: string;
  filters?: FirebaseFilterFor<Transaction>[];
  pagination: Pagination;
}
export const listTransactionsByBankId = async ({
  id,
  filters = [],
  pagination,
}: IListTransactionByBankId): Promise<
  AppModelResponse<PaginationResult<Transaction>>
> => {
  const funcName = "listTransactionsByBankId";

  try {
    const list = await firebasePaginatedList<Transaction>({
      collection: FirebaseCollection.transactions,
      filters: [
        { field: "bankAccountId", operator: "==", value: id },
        ...filters,
      ],
      pagination,
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
