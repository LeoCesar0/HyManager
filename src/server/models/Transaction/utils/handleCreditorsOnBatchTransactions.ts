import { slugify } from "@/utils/app";
import { Transaction } from "../schema";
import { listBankCreditors } from "../../BankCreditor/read/listBankCreditors";
import { WriteBatch } from "firebase/firestore";
import { batchBankCreditor } from "../../BankCreditor/create/batchBankCreditor";
import { DEFAULT_CATEGORY } from "../../BankAccount/static";
import { BankCreditor } from "../../BankCreditor/schema";

type IProps = {
  batch: WriteBatch;
  transactionsOnCreate: Transaction[];
  bankAccountId: string;
};

const defaultCat = [DEFAULT_CATEGORY["other-default"].id];

export const handleCreditorsOnBatchTransactions = async ({
  transactionsOnCreate,
  bankAccountId,
  batch,
}: IProps) => {
  // --------------------------
  // Handle Creditors
  // --------------------------
  const categoryByCreditor = transactionsOnCreate.reduce((acc, entry) => {
    const categories =
      entry.categories.length > 0 ? entry.categories : defaultCat;
    if (entry.creditor) {
      acc.set(entry.creditor, categories);
    }
    return acc;
  }, new Map<string, string[]>());

  console.log("categoryByCreditor", categoryByCreditor);

  const incomingCreditors = transactionsOnCreate.reduce((acc, entry) => {
    if (entry.creditor) {
      acc.add(entry.creditor);
    }
    return acc;
  }, new Set<string>());

  const existingCreditors =
    (await listBankCreditors({ bankAccountId })).data || [];

  const existingCreditorsMap = existingCreditors.reduce((acc, item) => {
    acc.set(item.creditorSlug, item);
    return acc;
  }, new Map());

  const bankCreditorsOnCreate: BankCreditor[] = [];

  incomingCreditors.forEach((incomingCreditor) => {
    const creditorSlug = slugify(incomingCreditor);
    const existingCreditor = existingCreditorsMap.has(creditorSlug);
    if (!existingCreditor) {
      const creditor = batchBankCreditor({
        batch,
        values: {
          bankAccountId,
          categories: categoryByCreditor.get(incomingCreditor) || defaultCat,
          creditorSlug: creditorSlug,
          creditor: incomingCreditor,
        },
      });
      bankCreditorsOnCreate.push(creditor);
    }
  });
  return bankCreditorsOnCreate;
};
