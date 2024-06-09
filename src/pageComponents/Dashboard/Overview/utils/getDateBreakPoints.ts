import { DateBreakPoint } from "@/server/utils/calculateDashboardSummary";
import { endOfMonth, startOfMonth, startOfWeek, sub } from "date-fns";

export const getDateBreakPoints = () => {
  const today = new Date();
  const lastMonth = sub(today, { months: 1 });
  const prevLastMonth = sub(today, { months: 2 });
  const startOfThisMonth = startOfMonth(today);
  const startLastMonth = startOfMonth(lastMonth);
  const startPrevLastMonth = startOfWeek(prevLastMonth);

  const breakPoints: DateBreakPoint[] = [
    // { key: "last-7", start: sub(today, { days: 7 }) },
    // { key: "last-30", start: sub(today, { days: 30 }) },
    // { key: "last-60", start: sub(today, { days: 60 }) },
    { key: "thisMonth", start: startOfThisMonth },
    {
      key: "lastMonth",
      start: startLastMonth,
      end: endOfMonth(startLastMonth),
    },
    { key: "prevLastMonth", start: startPrevLastMonth },
  ];

  const earliestBreakPoint = breakPoints.reduce((acc, entry) => {
    if (entry.start.getTime() < acc.start.getTime()) acc = entry;
    return acc;
  }, breakPoints[0]);

  return {
    breakPoints,
    earliestBreakPoint,
  };
};
