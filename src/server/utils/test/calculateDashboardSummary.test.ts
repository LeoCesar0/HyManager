import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import { calculateDashboardSummary } from "../calculateDashboardSummary";
import { mockTransactionsReport } from "./utils/mockTransactionsReport";
import { mockTransactions } from "./utils/mockTransactions";

const _listTransactionReportsBy: typeof listTransactionReportsBy = async (
  args
) => {
  const transactions = mockTransactions({
    count: 15,
    dateRange: [new Date(2024, 0, 1), new Date()],
  });

  const reports = mockTransactionsReport({
    transactions,
  });

  return {
    data: reports,
    done: true,
    error: null,
  };
};

describe("Test calculateDashboardSummary", () => {
  test("should calculate dashboard summary", () => {
    const result = calculateDashboardSummary({
      bankAccountId: "123",
      dateBreakPoints: [7, 30, 60, 180],
      _listTransactionReportsBy: _listTransactionReportsBy,
    });
  });
});
