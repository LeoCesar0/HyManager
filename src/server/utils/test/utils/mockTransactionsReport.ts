import { Transaction } from "@/server/models/Transaction/schema";
import { makeTransactionReports } from "@/server/models/TransactionReport/utils/makeTransactionReports";

export const mockTransactionsReport = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const bankAccountId = transactions[0].bankAccountId;

  const reports = makeTransactionReports({
    bankAccountId,
    transactions,
  });

  return reports;
};
