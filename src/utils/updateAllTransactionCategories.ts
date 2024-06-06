import { AppModelResponse } from "@/@types";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY,
} from "@/server/models/BankAccount/static";
import { listBankCreditors } from "@/server/models/BankCreditor/read/listBankCreditors";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import { listTransactionsByBankId } from "@/server/models/Transaction/read/listTransactionsByBankId";
import { Transaction } from "@/server/models/Transaction/schema";
import { updateManyTransactions } from "@/server/models/Transaction/update/updateManyTransactions";

type IProps = {
  bankAccountId: string;
};

export const updateAllTransactionCategories = async ({
  bankAccountId,
}: IProps): Promise<AppModelResponse<Transaction[]>> => {
  try {
    const creditorsRes = await listBankCreditors({
      bankAccountId,
    });

    const res = await listTransactionsByBankId({
      id: bankAccountId,
    });

    if (
      !res.data ||
      !res.data.length ||
      !creditorsRes.data ||
      !creditorsRes.data.length
    ) {
      return {
        data: null,
        done: false,
        error: {
          message: "Failed to update transactions",
        },
      };
    }

    const creditorsMap = creditorsRes.data.reduce<Map<string, BankCreditor>>(
      (acc, item) => {
        return acc.set(item.creditorSlug, item);
      },
      new Map()
    );

    const transactions = res.data.map((item) => {
      const creditor = creditorsMap.get(item.creditorSlug || "");
      const categories =
        item.creditorSlug && creditor ? creditor.categories : [];
      const updatedCategories =
        (item.categories.length === 1 &&
          item.categories[0] === DEFAULT_CATEGORY["other-default"].id) ||
        !item.categories.length
          ? categories
          : item.categories;
      return {
        ...item,
        categories: updatedCategories,
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
