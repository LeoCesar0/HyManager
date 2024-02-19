import { TransactionReport } from "@/server/models/TransactionReport/schema";
import { makeTransactionReportFields } from "../../../models/TransactionReport/utils/makeTransactionReportFields";
import { Transaction } from "@/server/models/Transaction/schema";

export const mockTransactionsReport = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const transactionsReport: TransactionReport[] = [];

  transactions.forEach((transaction) => {
    {
      const report = makeTransactionReportFields(transaction, "day");
      transactionsReport.push(report);
    }
    {
      const report = makeTransactionReportFields(transaction, "month");
      transactionsReport.push(report);
    }
  });

  return transactionsReport;
};
