import { slugify } from "@/utils/app";
import { Transaction } from "../models/Transaction/schema";
import {
  TransactionMin,
} from "../models/TransactionReport/schema";

export const makeTransactionMin = (
  transaction: Transaction | TransactionMin
): TransactionMin => {
  return {
    amount: transaction.amount,
    id: transaction.id,
    type: transaction.type,
    creditor: transaction.creditor || "",
    creditorSlug: slugify(transaction.creditor || ""),
  };
};
