import { TransactionType } from "@/server/models/Transaction/schema";

export const TRANSACTION_TYPE_LABELS = {
  [TransactionType.credit]: {
    en: "Credit",
    pt: "Crédito",
  },
  [TransactionType.debit]: {
    en: "Debit",
    pt: "Débito",
  },
};
