import { isWithinInterval, sub } from "date-fns";
import { listTransactionReportsBy } from "../models/TransactionReport/read/listTransactionReportBy";
import { TransactionsSummary } from "../models/TransactionReport/schema";
import currency from "currency.js";

export type DateBreakPoint = {
  key: string;
  start: Date;
  end?: Date;
};

type ICalculateDashboardSummary = {
  bankAccountId: string;
  dateBreakPoints?: DateBreakPoint[];
  _listTransactionReportsBy?: typeof listTransactionReportsBy;
  forcedNowDate?: Date;
};

export type DashboardSummary = {
  [key: string]: TransactionsSummary;
};

const defaultBreakPoints: DateBreakPoint[] = [
  { key: "last-7", start: new Date() },
  { key: "last-30", start: new Date() },
  { key: "last-60", start: new Date() },
];

const getBreakPointEnd = (breakPoint: DateBreakPoint, now: Date) => {
  return breakPoint.end ?? now;
};

export const calculateDashboardSummary = async ({
  bankAccountId,
  dateBreakPoints = defaultBreakPoints,
  forcedNowDate,
  _listTransactionReportsBy = listTransactionReportsBy,
}: ICalculateDashboardSummary) => {
  const earliestBreakPoint = dateBreakPoints.reduce((acc, entry) => {
    if (entry.start.getTime() < acc.start.getTime()) acc = entry;
    return acc;
  }, defaultBreakPoints[0]);

  const now = forcedNowDate ?? new Date();

  const response = await _listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: "day",
    filters: [
      { field: "date", operator: ">=", value: earliestBreakPoint.start },
    ],
  });

  let reports = response.data || [];

  const result: DashboardSummary = reports.reduce((acc, report) => {
    const reportDate = report.date.toDate();

    dateBreakPoints.forEach((breakPoint) => {
      const key = breakPoint.key;

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
