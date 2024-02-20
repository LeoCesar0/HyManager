import { sub } from "date-fns";
import { listTransactionReportsBy } from "../models/TransactionReport/read/listTransactionReportBy";
import { TransactionsSummary } from "../models/TransactionReport/schema";
import differenceInDays from "date-fns/differenceInDays";
import currency from "currency.js";

type ICalculateDashboardSummary = {
  bankAccountId: string;
  dateBreakPoints?: number[];
  _listTransactionReportsBy?: typeof listTransactionReportsBy;
  forcedNowDate?: Date;
};

export type SummaryExpenses = {
  [key: string]: TransactionsSummary;
};

export const calculateDashboardSummary = async ({
  bankAccountId,
  dateBreakPoints = [7, 30, 60],
  forcedNowDate,
  _listTransactionReportsBy = listTransactionReportsBy,
}: ICalculateDashboardSummary) => {
  const earliestBreakPoint = dateBreakPoints.reduce((acc, current) => {
    if (current > acc) acc = current;
    return acc;
  }, 0);

  const now = forcedNowDate ?? new Date();
  const pastDate = sub(now, {
    days: earliestBreakPoint,
  });

  const response = await _listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: "day",
    filters: [{ field: "date", operator: ">=", value: pastDate }],
  });

  let reports = response.data || [];

  const result: SummaryExpenses = reports.reduce((acc, report) => {

    if(report.dateDay === '13'){
      console.log('report', report)
    }

    dateBreakPoints.forEach((breakPoint) => {
      const key = breakPoint.toString();

      const diff = differenceInDays(now, report.date.toDate());

      if (diff <= breakPoint) {
        if (!acc[key]) {
          acc[key] = {
            biggestDebit: null,
            biggestDeposit: null,
            totalDeposits: 0,
            totalExpenses: 0,
          };
        }

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
  }, {} as SummaryExpenses);

  return result;
};
