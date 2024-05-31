import { AppModelResponse } from "@/@types";
import { listTransactionsByBankId } from "@/server/models/Transaction/read/listTransactionsByBankId";
import { Transaction } from "@/server/models/Transaction/schema";
import { updateManyTransactions } from "@/server/models/Transaction/update/updateManyTransactions";

type Props = {
  bankAccountId: string;
  categories: string[];
  creditorSlug: string;
};

export const updateTransactionsCategories = async ({
  bankAccountId,
  creditorSlug,
  categories,
}: Props): Promise<AppModelResponse<Transaction[]>> => {
  try {
    const res = await listTransactionsByBankId({
      id: bankAccountId,
      filters: [
        {
          field: "creditorSlug",
          operator: "==",
          value: creditorSlug,
        },
      ],
    });

    if (!res.data || !res.data.length)
      return {
        data: null,
        done: false,
        error: {
          message: "Failed to update transactions",
        },
      };

    const transactions = res.data.map((item) => {
      return {
        ...item,
        categories: categories,
      };
    });

    return await updateManyTransactions({
      transactions: transactions,
    });
  } catch (err) {
    return {
      data: null,
      done: false,
      error: {
        message: "Failed to update transactions",
      },
    };
  }
};
