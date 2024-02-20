import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import {
  calculateDashboardSummary,
  DateBreakPoint,
} from "../calculateDashboardSummary";
import { mockTransactionsReport } from "./utils/mockTransactionsReport";
import { getTestPDFData } from "./utils/getTestPDFData";
import { TEST_CONFIG } from "@/static/testConfig";
import {
  Transaction,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { makeTransactionFields } from "../../models/Transaction/utils/makeTransactionFields";
import differenceInDays from "date-fns/differenceInDays";
import currency from "currency.js";
import { sub } from "date-fns";

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
  }).filter((item) => item.type === "day");

  return {
    data: reports,
    done: true,
    error: null,
  };
};

describe("Test calculateDashboardSummary", () => {
  test("should calculate dashboard summary", async () => {
    const forcedNowDate = new Date(2023, 5, 29);

    const breakPoints: DateBreakPoint[] = [
      {
        key: "last-7",
        start: sub(forcedNowDate, { days: 7 }),
      },
      {
        key: "last-30",
        start: sub(forcedNowDate, { days: 30 }),
      },
    ];

    const result = await calculateDashboardSummary({
      bankAccountId: "123",
      dateBreakPoints: breakPoints,
      forcedNowDate,
      _listTransactionReportsBy: _listTransactionReportsBy,
    });

    expect(result["last-7"]).toBeTruthy();
    expect(result["last-30"]).toBeTruthy();
    expect(result["21"]).toBeFalsy();

    expect(result["last-7"].biggestDebit?.amount).toBe(-2100);
    expect(result["last-7"].biggestDeposit).toBe(null);
    expect(result["last-7"].totalDeposits).toBe(0);
    expect(result["last-7"].totalExpenses).toBe(-6521.5);

    expect(result["last-30"].biggestDebit?.amount).toBe(-2100);
    expect(result["last-30"].biggestDeposit?.amount).toBe(5000);
    expect(result["last-30"].totalDeposits).toBe(5203.75);
    expect(result["last-30"].totalExpenses).toBe(-9713.52);
  });
});
