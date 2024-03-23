import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import { TransactionReport } from '@/server/models/TransactionReport/schema';
import {
  calculateDashboardSummary,
  DashboardSummary,
  DateBreakPoint,
} from "@/server/utils/calculateDashboardSummary";

type IGetDashboardOverviewData = {
  dateBreakPoints: DateBreakPoint[];
  bankAccountId: string;
};

export type DashboardOverviewData = {
  transactionReports: TransactionReport[]
  dashboardSummary: DashboardSummary
}

export const getDashboardOverviewData = async ({
  dateBreakPoints,
  bankAccountId,
}: IGetDashboardOverviewData): Promise<DashboardOverviewData> => {
  const earliestBreakPoint = dateBreakPoints.reduce((acc, entry) => {
    if (entry.start.getTime() < acc.start.getTime()) acc = entry;
    return acc;
  }, dateBreakPoints[0]);

  const response = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: "day",
    filters: [
      { field: "date", operator: ">=", value: earliestBreakPoint.start },
    ],
  });

  let transactionReports = response.data || [];

  const dashboardSummary = calculateDashboardSummary({
    bankAccountId: bankAccountId,
    dateBreakPoints: dateBreakPoints,
    reports: transactionReports,
  });

    return {
      transactionReports,
      dashboardSummary
    };
};
