import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import { calculateDashboardSummary } from "../calculateDashboardSummary";
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

    const breakPoints = [7, 30, 60];

    const result = await calculateDashboardSummary({
      bankAccountId: "123",
      dateBreakPoints: [7, 30, 60],
      forcedNowDate,
      _listTransactionReportsBy: _listTransactionReportsBy,
    });

    const reports = await _listTransactionReportsBy({
      bankAccountId: "123",
      filters: [],
    });

    const expectedTotalExpenses = reports.data?.reduce((acc, entry) => {
      breakPoints.forEach((breakPoint) => {
        const key = breakPoint.toString();
        if (!acc[key]) acc[key] = 0;

        entry.transactions.forEach((trans) => {
          const diff = differenceInDays(forcedNowDate, entry.date.toDate());
          if (diff <= breakPoint && trans.type === TransactionType.debit) {
            acc[key] = currency(acc[key]).add(trans.amount).value;
          }
        });
      });

      return acc;
    }, {} as { [key: string]: number });

    expect(result["7"]).toBeTruthy();
    expect(result["30"]).toBeTruthy();
    expect(result["60"]).toBeTruthy();
    expect(result["21"]).toBeFalsy();

    expect(result["7"].biggestDebit?.amount).toBe(-2100);
    expect(result["7"].biggestDeposit).toBe(null);
    expect(result["7"].totalDeposits).toBe(0);
    expect(result["7"].totalExpenses).toBe(expectedTotalExpenses?.["7"]);

    expect(result["30"].biggestDebit?.amount).toBe(-2100);
    expect(result["30"].biggestDeposit?.amount).toBe(5000);
    expect(result["30"].totalDeposits).toBe(5203.75);
    expect(result["30"].totalExpenses).toBe(-9742.24);


  });
});
