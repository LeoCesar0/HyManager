import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import { calculateDashboardSummary } from "../calculateDashboardSummary";
import { mockTransactionsReport } from "./utils/mockTransactionsReport";
import { getTestPDFData } from "./utils/getTestPDFData";
import { TEST_CONFIG } from "@/static/testConfig";
import { Transaction } from "@/server/models/Transaction/schema";
import { makeTransactionFields } from "../../models/Transaction/utils/makeTransactionFields";

const _listTransactionReportsBy: typeof listTransactionReportsBy = async (
  args
) => {
  const result = await getTestPDFData({
    filePathList: [TEST_CONFIG.pdf["2023-06"].path],
  });
  const transactions: Transaction[] = result
    .map((item) => {
      return item.transactions.map((transactionInputs) =>
        makeTransactionFields({
          bankAccountId: TEST_CONFIG.bankAccountId,
          transactionInputs: {
            ...transactionInputs,
            date: new Date(transactionInputs.date),
          },
        })
      );
    })
    .flat();

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
  test("should calculate dashboard summary", async () => {
    const forcedNowDate = new Date("2023-06-30");

    const result = await calculateDashboardSummary({
      bankAccountId: "123",
      dateBreakPoints: [7, 30, 60],
      forcedNowDate,
      _listTransactionReportsBy: _listTransactionReportsBy,
    });

    expect(result["7"]).toBeTruthy();
    expect(result["30"]).toBeTruthy();
    expect(result["60"]).toBeTruthy();
    expect(result["21"]).toBeFalsy();
  });
});
