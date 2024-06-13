import {
  calculateDashboardSummary,
  DateBreakPoint,
} from "../calculateDashboardSummary";
import { getTestPDFData } from "./utils/getTestPDFData";
import { TEST_CONFIG } from "@/static/testConfig";
import { Transaction } from "@/server/models/Transaction/schema";
import { makeTransactionFields } from "../../models/Transaction/utils/makeTransactionFields";
import { sub } from "date-fns";

const _listTransactionReportsBy = async (filePathList: string[]) => {
  const result = await getTestPDFData({
    filePathList,
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

  // const reports = mockTransactionsReport({
  //   transactions,
  // }).filter((item) => item.type === "day");

  return transactions;
};

describe("Test calculateDashboardSummary #current", () => {
  test("should calculate dashboard summary", async () => {
    const endDate = new Date(2023, 5, 29);

    const breakPoints: DateBreakPoint[] = [
      {
        key: "thisMonth",
        start: sub(endDate, { days: 30 }),
        end: endDate,
      },
    ];

    const transactions = await _listTransactionReportsBy([
      TEST_CONFIG.pdf["2023-06"].path,
    ]);

    const result = calculateDashboardSummary({
      bankAccountId: "123",
      dateBreakPoints: breakPoints,
      transactions,
    });
    // TODO

    expect(result["thisMonth"]).toBeTruthy();

    expect(result["thisMonth"]?.biggestDebit?.amount).toBe(-2100);
    expect(result["thisMonth"]?.biggestDeposit?.amount).toBe(5000);
    expect(result["thisMonth"]?.totalDeposits).toBe(5203.75);
    expect(result["thisMonth"]?.totalExpenses).toBe(-9713.52);
  });
});
