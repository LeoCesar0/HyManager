import {
  Transaction,
  transactionSchema,
  TransactionType,
} from "@/server/models/Transaction/schema";
import {
  TransactionsSummary,
  transactionsSummarySchema,
} from "@/server/models/TransactionReport/schema";
import cloneDeep from "lodash.clonedeep";
import { calculateTransactionsSummary } from "../calculateTransactionsSummary";
import { mockTransactions } from "./utils/mockTransactions";

describe("Test calculateTransactionsSummary", () => {
  let transactions: Transaction[] = [];

  let result: TransactionsSummary;

  beforeAll(() => {
    transactions = mockTransactions({ count: 12 });
    result = calculateTransactionsSummary({ transactions });
  });

  test("should return a valid TransactionsSummary object", () => {
    const validation = transactionsSummarySchema.safeParse(result);

    expect(validation.success).toBe(true);
  });

  test("should return the correct totalDeposits", () => {
    const totalDeposits = transactions.reduce(
      (acc, current) =>
        current.type === "deposit" ? acc + current.amount : acc,
      0
    );

    expect(result.totalDeposits).toBe(totalDeposits);
  });

  test("should return the correct totalExpenses", () => {
    const totalExpenses = transactions.reduce(
      (acc, current) => (current.type === "debit" ? acc + current.amount : acc),
      0
    );

    expect(result.totalExpenses).toBe(totalExpenses);
  });

  test("should get the correct biggest deposit", () => {
    const biggestDeposit = transactions.reduce(
      (acc, entry) => {
        if (
          entry.type === TransactionType.deposit &&
          entry.amount > acc!.amount
        ) {
          acc = cloneDeep(entry);
        }

        return acc;
      },
      transactions.find((item) => item.type === TransactionType.deposit)
    );

    expect(biggestDeposit?.id).toBe(result.biggestDeposit?.id);
    expect(biggestDeposit?.amount).toBe(result.biggestDeposit?.amount);
  });

  test("should get the correct biggest debit", () => {
    const biggestDebit = transactions.reduce(
      (acc, entry) => {
        if (
          entry.type === TransactionType.debit &&
          Math.abs(entry.amount) > Math.abs(acc!.amount)
        ) {
          acc = cloneDeep(entry);
        }

        return acc;
      },
      transactions.find((item) => item.type === TransactionType.debit)
    );

    expect(biggestDebit?.id).toBe(result.biggestDebit?.id);
    expect(biggestDebit?.amount).toBe(result.biggestDebit?.amount);
  });
});
