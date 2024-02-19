import { sub } from "date-fns";
import { listTransactionReportsBy } from "../models/TransactionReport/read/listTransactionReportBy";
import { TransactionsSummary } from "../models/TransactionReport/schema";
import differenceInDays from 'date-fns/differenceInDays'

type ICalculateDashboardSummary = {
  bankAccountId: string;
  dateBreakPoints?: number[];
  _listTransactionReportsBy?: typeof listTransactionReportsBy
};

export type SummaryExpenses = {
    [key: string]: TransactionsSummary
}

export const calculateDashboardSummary = async ({
  bankAccountId,
  dateBreakPoints = [7, 30, 60],
  _listTransactionReportsBy = listTransactionReportsBy
}: ICalculateDashboardSummary) => {

    const earliestBreakPoint = dateBreakPoints.reduce((acc, current) => {
        if (current > acc) acc = current
        return acc
    },0)

    const now = new Date();
    const pastDate = sub(now, {
        days: earliestBreakPoint
    });

  const response = await _listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: "day",
    filters:[{field: "date", operator: ">=", value: pastDate}]
  });

  const reports = response.data || [];

  const result:SummaryExpenses = reports.reduce((acc, report) => {

    dateBreakPoints.forEach(breakPoint => {
        const key = breakPoint.toString()

        const diff = differenceInDays(now, report.date.toDate())

        if (diff <= breakPoint) {
            if (!acc[key]) {
                acc[key] = report.summary
            }

           
        }

    })

    return acc
  },{} as SummaryExpenses)


  return result

 
};
