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

interface IPaginateTransactionByBankId {
  id: string;
  filters?: FirebaseFilterFor<Transaction>[];
  pagination: Pagination;
}
export const paginateTransactionsByBankId = async ({
  id,
  filters = [],
  pagination,
}: IPaginateTransactionByBankId): Promise<
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
