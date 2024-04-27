import { Transaction, TransactionType } from "../../Transaction/schema";
import { TransactionReport } from "../schema";
import { makeTransactionReportFields } from "./makeTransactionReportFields";
import { Timestamp } from "firebase/firestore";

describe("makeTransactionReportFields", () => {
  const bankAccountId = "123@123";

  it("should return the correct values", () => {
    const type: TransactionReport["type"] = "day";

    const transactions: Transaction[] = [
      {
        id: "2",
        amount: -24.57,
        type: TransactionType.debit,
        date: Timestamp.fromDate(new Date("2020-01-01T05:00:00")),
        updatedBalance: 100,
        creditor: "John Doe",
        creditorSlug: "john-doe",
      },
      {
        id: "3",
        amount: -25,
        type: TransactionType.debit,
        date: Timestamp.fromDate(new Date("2020-01-01T07:00:00")),
        updatedBalance: 75,
        creditor: "Jane Doe",
        creditorSlug: "jane-doe",
      },
      {
        id: "1",
        amount: 90.6,
        type: TransactionType.deposit,
        date: Timestamp.fromDate(new Date("2020-01-01T03:00:00")),
        updatedBalance: 124.57,
        creditor: "Jane Doe",
        creditorSlug: "jane-doe",
      },
      {
        id: "4",
        amount: 66.25,
        type: TransactionType.deposit,
        date: Timestamp.fromDate(new Date("2020-01-01T09:00:00")),
        updatedBalance: 141.25,
        creditor: "Jane Doe",
        creditorSlug: "jane-doe",
      },
    ] as Transaction[];

    const result = makeTransactionReportFields({
      transactions,
      type,
      bankAccountId,
    });

    expect(result.amount).toBe(107.28);
    expect(result.finalBalance).toBe(141.25);
    expect(result.initialBalance).toBe(33.97);
    expect(result.summary.biggestDebit?.amount).toBe(-25);
    expect(result.summary.biggestDeposit?.amount).toBe(90.6);
    expect(result.summary.totalDeposits).toBe(156.85);
    expect(result.summary.totalExpenses).toBe(-49.57);

    // 33.97
  });
});
