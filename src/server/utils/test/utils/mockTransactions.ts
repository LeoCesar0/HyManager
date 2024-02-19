import {
  Transaction,
  transactionSchema,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { generateMock } from "@anatine/zod-mock";

export const mockTransactions = ({ count }: { count: number }) => {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const mockData = generateMock(transactionSchema);

    const randomAmount = Math.floor(Math.random() * 2001) - 1000;

    if (randomAmount > 0) {
      mockData.type = TransactionType.deposit;
    } else {
      mockData.type = TransactionType.debit;
    }

    transactions.push(mockData);
  }

  return transactions;
};
