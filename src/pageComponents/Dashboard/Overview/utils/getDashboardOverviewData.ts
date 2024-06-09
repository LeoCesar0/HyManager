import { DashboardOverviewConfig } from "@/contexts/GlobalDashboardStore";
import { Transaction } from "@/server/models/Transaction/schema";
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
  transactions: Transaction[];
};

export type DashboardOverviewData = {
  dashboardSummary: DashboardSummary;
};

export const getDashboardOverviewData = async ({
  overviewConfig,
  bankAccountId,
  transactions,
}: IGetDashboardOverviewData): Promise<DashboardOverviewData> => {
  const { dateBreakPoints } = overviewConfig;

  const dashboardSummary = calculateDashboardSummary({
    bankAccountId: bankAccountId,
    dateBreakPoints: dateBreakPoints,
    transactions: transactions,
  });

  return {
    dashboardSummary,
  };
};
