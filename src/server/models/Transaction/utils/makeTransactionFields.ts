import { makeTransactionSlug } from "@/server/utils/makeTransactionSlug";
import { slugify } from "@/utils/app";
import { makeDateFields } from "@/utils/date/makeDateFields";
import { Timestamp } from "firebase/firestore";
import { CreateTransaction, Transaction, transactionSchema } from "../schema";

export const makeTransactionFields = ({
  transactionInputs,
  bankAccountId,
}: {
  transactionInputs: CreateTransaction;
  bankAccountId: string;
}) => {
  const date = new Date(transactionInputs.date);
  const firebaseTimestamp = Timestamp.fromDate(date);
  const now = new Date();
  const slugId = makeTransactionSlug({
    date: transactionInputs.date,
    amount: transactionInputs.amount,
    idFromBank: transactionInputs.idFromBank,
    creditor: transactionInputs.creditor || "",
  });
  const transaction: Transaction = {
    ...transactionInputs,
    bankAccountId: bankAccountId,
    id: slugId,
    slug: slugId,
    date: firebaseTimestamp,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    ...makeDateFields(date),
  };
  if (transaction.creditor) {
    transaction.creditorSlug = slugify(transaction.creditor);
  }

  transactionSchema.parse(transaction);

  return transaction
};
