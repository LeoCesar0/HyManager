import { Transaction, TransactionType } from "../models/Transaction/schema";
import { makeTransactionMin } from "./makeTransactionMin";
import { TransactionMin, TransactionsSummary } from "../models/TransactionReport/schema";

type ICalculateTransactionsSummary = {
  transactions: (Transaction | TransactionMin)[];
};

export const calculateTransactionsSummary = ({
  transactions,
}: ICalculateTransactionsSummary): TransactionsSummary => {
  const result = transactions.reduce(
    (acc, current) => {
      const amount = Math.abs(current.amount);

      if (current.type === TransactionType.debit) {
        if (amount > Math.abs(acc.biggestDebit?.amount || 0)) {
          acc.biggestDebit = makeTransactionMin(current);
        }
        acc.totalExpenses += current.amount;
      }

      if (current.type === TransactionType.deposit) {
        if (amount > (acc.biggestDeposit?.amount || 0)) {
          acc.biggestDeposit = makeTransactionMin(current);
        }
        acc.totalDeposits += current.amount;
      }
      return acc;
    },
    {
      biggestDebit: null,
      biggestDeposit: null,
      totalDeposits: 0,
      totalExpenses: 0,
    } as TransactionsSummary
  );

  return result;
};
