import { DashboardOverviewConfig } from "@/contexts/GlobalDashboardStore";
import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import { TransactionReport } from "@/server/models/TransactionReport/schema";
import {
  calculateDashboardSummary,
  DashboardSummary,
  DateBreakPoint,
} from "@/server/utils/calculateDashboardSummary";

type IGetDashboardOverviewData = {
  bankAccountId: string;
  overviewConfig: DashboardOverviewConfig;
};

export type DashboardOverviewData = {
  transactionReports: TransactionReport[];
  dashboardSummary: DashboardSummary;
};

export const getDashboardOverviewData = async ({
  overviewConfig,
  bankAccountId,
}: IGetDashboardOverviewData): Promise<DashboardOverviewData> => {
  const { dateBreakPoints, earliestBreakPoint } = overviewConfig;

  const response = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: "day",
    filters: [
      { field: "date", operator: ">=", value: earliestBreakPoint.start },
    ],
  });

  let transactionReports = response.data || [];
  transactionReports.sort((a, b) => a.date.seconds - b.date.seconds);

  const dashboardSummary = calculateDashboardSummary({
    bankAccountId: bankAccountId,
    dateBreakPoints: dateBreakPoints,
    reports: transactionReports,
  });

  return {
    transactionReports,
    dashboardSummary,
  };
};
