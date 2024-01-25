import { TransactionType } from "@/server/models/Transaction/schema";

export const TRANSACTION_TYPE_LABELS = {
  [TransactionType.deposit]: {
    en: "Deposit",
    pt: "Depósito",
  },
  [TransactionType.debit]: {
    en: "Debit",
    pt: "Débito",
  },
};
