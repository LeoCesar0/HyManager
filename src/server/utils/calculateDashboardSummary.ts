import { isWithinInterval } from "date-fns";
import {
  TransactionReport,
  TransactionsSummary,
} from "../models/TransactionReport/schema";
import currency from "currency.js";

export type SummaryBreakPointKey = "thisMonth" | "lastMonth" | "thisWeek";

export const SUMMARY_BREAK_POINTS: SummaryBreakPointKey[] = [
  "thisMonth",
  "lastMonth",
  "thisWeek",
];

export type DateBreakPoint = {
  key: SummaryBreakPointKey;
  start: Date;
  end?: Date;
};

type ICalculateDashboardSummary = {
  bankAccountId: string;
  dateBreakPoints: DateBreakPoint[];
  reports: TransactionReport[];
};

export type DashboardSummary = {
  [key in SummaryBreakPointKey]?: TransactionsSummary;
  // thisMonth: TransactionsSummary;
  // lastMonth: TransactionsSummary;
  // prevLastMonth: TransactionsSummary;
  // thisWeek: TransactionsSummary;
};

const getBreakPointEnd = (breakPoint: DateBreakPoint, now: Date) => {
  return breakPoint.end ?? now;
};

export const calculateDashboardSummary = ({
  dateBreakPoints,
  reports,
}: ICalculateDashboardSummary) => {
  const now = new Date();

  const result: DashboardSummary = reports.reduce((acc, report) => {
    const reportDate = report.date.toDate();

    // console.log('report', report)

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

      const isBetweenIntervals = isWithinInterval(reportDate, {
        end: breakPointEnd,
        start: breakPointStart,
      });

      if (isBetweenIntervals) {
        // --------------------------
        // Check for biggestDebit and biggestDeposit
        // --------------------------
        if (
          report.summary.biggestDebit &&
          Math.abs(report.summary.biggestDebit.amount) >
            Math.abs(entry.biggestDebit?.amount || 0)
        ) {
          entry.biggestDebit = report.summary.biggestDebit;
        }

        if (
          report.summary.biggestDeposit &&
          report.summary.biggestDeposit.amount >
            (entry.biggestDeposit?.amount || 0)
        ) {
          entry.biggestDeposit = report.summary.biggestDeposit;
        }

        entry.totalDeposits = currency(entry.totalDeposits).add(
          report.summary.totalDeposits
        ).value;

        entry.totalExpenses = currency(entry.totalExpenses).add(
          report.summary.totalExpenses
        ).value;
      }
    });

    return acc;
  }, {} as DashboardSummary);

  return result;
};
