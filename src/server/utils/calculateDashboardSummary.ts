import { isWithinInterval } from "date-fns";
import { TransactionsSummary } from "../models/TransactionReport/schema";
import currency from "currency.js";
import { Transaction, TransactionType } from "../models/Transaction/schema";

export type SummaryBreakPointKey = "thisMonth" | "lastMonth" | "prevLastMonth";

export const SUMMARY_BREAK_POINTS: SummaryBreakPointKey[] = [
  "thisMonth",
  "lastMonth",
  "prevLastMonth",
];

export type DateBreakPoint = {
  key: SummaryBreakPointKey;
  start: Date;
  end?: Date;
};

type ICalculateDashboardSummary = {
  bankAccountId: string;
  dateBreakPoints: DateBreakPoint[];
  transactions: Transaction[];
};

export type DashboardSummary = {
  [key in SummaryBreakPointKey]?: TransactionsSummary;
};

const getBreakPointEnd = (breakPoint: DateBreakPoint, now: Date) => {
  return breakPoint.end ?? now;
};

export const calculateDashboardSummary = ({
  dateBreakPoints,
  transactions,
}: ICalculateDashboardSummary) => {
  const now = new Date();

  const result: DashboardSummary = transactions.reduce((acc, transaction) => {
    const transactionDate = transaction.date.toDate();

    dateBreakPoints.forEach((breakPoint) => {
      const key = breakPoint.key;

      if (!acc[key]) {
        acc[key] = {
          biggestDebit: null,
          biggestDeposit: null,
          totalDeposits: 0,
          totalExpenses: 0,
        };
      }

      const entry = acc[key]!;

      const breakPointStart = breakPoint.start;
      const breakPointEnd = getBreakPointEnd(breakPoint, now);

      const isBetweenIntervals = isWithinInterval(transactionDate, {
        end: breakPointEnd,
        start: breakPointStart,
      });

      if (isBetweenIntervals) {
        // --------------------------
        // Check for biggestDebit and biggestDeposit
        // --------------------------
        if (
          transaction.type === TransactionType.debit &&
          Math.abs(transaction.amount) >
            Math.abs(entry.biggestDebit?.amount || 0)
        ) {
          entry.biggestDebit = {
            amount: transaction.amount,
            id: transaction.id,
            creditor: transaction.creditor,
            creditorSlug: transaction.creditorSlug,
            type: transaction.type,
          };
        }

        if (
          transaction.type === TransactionType.deposit &&
          Math.abs(transaction.amount) > (entry.biggestDeposit?.amount || 0)
        ) {
          entry.biggestDeposit = {
            amount: transaction.amount,
            id: transaction.id,
            creditor: transaction.creditor,
            creditorSlug: transaction.creditorSlug,
            type: transaction.type,
          };
        }

        if (transaction.type === TransactionType.debit) {
          entry.totalExpenses = currency(entry.totalExpenses).add(
            transaction.amount
          ).value;
        }

        if (transaction.type === TransactionType.deposit) {
          entry.totalDeposits = currency(entry.totalDeposits).add(
            transaction.amount
          ).value;
        }
      }
    });

    return acc;
  }, {} as DashboardSummary);

  return result;
};
