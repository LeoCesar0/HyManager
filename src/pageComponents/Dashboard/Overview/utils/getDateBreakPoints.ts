import { DateBreakPoint } from "@/server/utils/calculateDashboardSummary";
import { endOfMonth, startOfMonth, startOfWeek, sub } from "date-fns";

export const getDateBreakPoints = (): DateBreakPoint[] => {
  const today = new Date();
  const lastMonth = sub(today, { months: 1 });
  const startOfThisWeek = startOfWeek(today);
  const startOfThisMonth = startOfMonth(today);
  const startLastMonth = startOfMonth(lastMonth);

  const breakPoints: DateBreakPoint[] = [
    // { key: "last-7", start: sub(today, { days: 7 }) },
    // { key: "last-30", start: sub(today, { days: 30 }) },
    // { key: "last-60", start: sub(today, { days: 60 }) },
    { key: "this-week", start: startOfThisWeek },
    { key: "this-month", start: startOfThisMonth },
    {
      key: "last-month",
      start: startLastMonth,
      end: endOfMonth(startLastMonth),
    },
  ];

  return breakPoints;
};
