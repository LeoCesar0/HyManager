import { FirebaseFilterFor, Pagination } from "@/@types";
import { BankCreditor } from "../schema";
import { FirebaseCollection } from "@/server/firebase";
import { debugDev } from "@/utils/dev";
import { firebasePaginatedList } from "@/server/firebase/firebasePaginatedList";

export type IPaginateBankCreditors = {
  bankAccountId: string;
  pagination: Pagination;
  filters?: FirebaseFilterFor<BankCreditor>[];
};

export const paginateBankCreditors = async ({
  bankAccountId,
  pagination,
  filters = [],
}: IPaginateBankCreditors) => {
  const funcName = "paginateBankCreditors";

  try {
    if (!bankAccountId) {
      throw new Error("Bank Account Id is required");
    }
    const _filters: FirebaseFilterFor<BankCreditor>[] = [
      {
        field: "bankAccountId",
        operator: "==",
        value: bankAccountId,
      },
    ];
    _filters.push(...filters);
    const data = await firebasePaginatedList<BankCreditor>({
      collection: FirebaseCollection.bankCreditors,
      filters: _filters,
      pagination,
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
