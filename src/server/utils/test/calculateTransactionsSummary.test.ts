import { TransactionsSummary } from "@/server/models/TransactionReport/schema";
import { calculateTransactionsSummary } from "../calculateTransactionsSummary";
import { TransactionType } from "../../models/Transaction/schema";

describe("Test calculateTransactionsSummary", () => {
  // @ts-expect-error
  let transactions: [] = [
    {
      amount: 100,
      type: TransactionType.deposit,
      id: "1",
      creditor: "123123",
      creditorSlug: "123123",
    },
    {
      amount: -52,
      type: TransactionType.debit,
      id: "2",
      creditor: "123123",
      creditorSlug: "123123",
    },
    {
      amount: 126,
      type: TransactionType.deposit,
      id: "3",
      creditor: "123123",
      creditorSlug: "123123",
    },
    {
      amount: -5,
      type: TransactionType.debit,
      id: "4",
      creditor: "123123",
      creditorSlug: "123123",
    },
  ];
  let result: TransactionsSummary;

  beforeAll(() => {
    result = calculateTransactionsSummary({ transactions });
  });

  it("should return correctly values", () => {
    expect(result.biggestDebit?.amount).toBe(-52);
    expect(result.biggestDeposit?.amount).toBe(126);
    expect(result.totalDeposits).toBe(226);
    expect(result.totalExpenses).toBe(-57);
  });
});
