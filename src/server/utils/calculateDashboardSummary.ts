import { format, isWithinInterval } from "date-fns";
import {
  TransactionReport,
  TransactionsSummary,
} from "../models/TransactionReport/schema";
import currency from "currency.js";

export type DateBreakPoint = {
  key: string;
  start: Date;
  end?: Date;
};

type ICalculateDashboardSummary = {
  bankAccountId: string;
  dateBreakPoints: DateBreakPoint[];
  reports: TransactionReport[];
};

export type DashboardSummary = {
  [key: string]: TransactionsSummary;
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

      // console.log('breakPoint', breakPoint)

      const breakPointStart = breakPoint.start;
      const breakPointEnd = getBreakPointEnd(breakPoint, now);

      const isBetweenIntervals = isWithinInterval(reportDate, {
        end: breakPointEnd,
        start: breakPointStart,
      });

      if (!acc[key]) {
        acc[key] = {
          biggestDebit: null,
          biggestDeposit: null,
          totalDeposits: 0,
          totalExpenses: 0,
        };
      }

      if (isBetweenIntervals) {
        // --------------------------
        // Check for biggestDebit and biggestDeposit
        // --------------------------
        if (
          report.summary.biggestDebit &&
          Math.abs(report.summary.biggestDebit.amount) >
            Math.abs(acc[key].biggestDebit?.amount || 0)
        ) {
          acc[key].biggestDebit = report.summary.biggestDebit;
        }

        if (
          report.summary.biggestDeposit &&
          report.summary.biggestDeposit.amount >
            (acc[key].biggestDeposit?.amount || 0)
        ) {
          acc[key].biggestDeposit = report.summary.biggestDeposit;
        }

        acc[key].totalDeposits = currency(acc[key].totalDeposits).add(
          report.summary.totalDeposits
        ).value;

        acc[key].totalExpenses = currency(acc[key].totalExpenses).add(
          report.summary.totalExpenses
        ).value;
      }
    });

    return acc;
  }, {} as DashboardSummary);

  return result;
};
