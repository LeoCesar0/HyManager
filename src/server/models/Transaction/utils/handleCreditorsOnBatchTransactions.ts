import { slugify } from "@/utils/app";
import { Transaction } from "../schema";
import { listBankCreditors } from "../../BankCreditor/read/listBankCreditors";
import { WriteBatch } from "firebase/firestore";
import { batchBankCreditor } from "../../BankCreditor/create/batchBankCreditor";
import { DEFAULT_CATEGORY } from "../../BankAccount/static";

type IProps = {
  batch: WriteBatch;
  transactionsOnCreate: Transaction[];
  bankAccountId: string;
};

export const handleCreditorsOnBatchTransactions = async ({
  transactionsOnCreate,
  bankAccountId,
  batch,
}: IProps) => {
  // --------------------------
  // Handle Creditors
  // --------------------------
  const incomingCreditors = transactionsOnCreate.reduce((acc, entry) => {
    if (entry.creditor) {
      acc.add(slugify(entry.creditor));
    }
    return acc;
  }, new Set<string>());

  const existingCreditors =
    (await listBankCreditors({ bankAccountId })).data || [];

  incomingCreditors.forEach((incomingCreditor) => {
    const existingCreditor = existingCreditors.find(
      (item) => item.creditorSlug === incomingCreditor
    );
    if (!existingCreditor) {
      batchBankCreditor({
        batch,
        values: {
          bankAccountId,
          categorySlug: DEFAULT_CATEGORY["other-default"].slug,
          creditorSlug: incomingCreditor,
        },
      });
    }
  });
};
