import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import {
  calculateDashboardSummary,
  DateBreakPoint,
} from "@/server/utils/calculateDashboardSummary";

type IHandleGetSummary = {
  dateBreakPoints: DateBreakPoint[];
  bankAccountId: string;
};

export const handleGetSummary = async ({
  dateBreakPoints,
  bankAccountId,
}: IHandleGetSummary) => {
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

  let reports = response.data || [];

  const result = calculateDashboardSummary({
    bankAccountId: bankAccountId,
    dateBreakPoints: dateBreakPoints,
    reports,
  });

  return result;
};
