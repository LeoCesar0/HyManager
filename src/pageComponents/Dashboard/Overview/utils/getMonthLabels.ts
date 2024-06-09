import { sub } from "date-fns";

export const getMonthLabels = () => {
  const now = new Date();
  const lastMonthDate = sub(now, { months: 1 });
  const prevLastMonthDate = sub(now, { months: 2 });

  const enThisMonth = now.toLocaleString("en", { month: "long" });
  const ptThisMonth = now.toLocaleString("pt", { month: "long" });

  const enLastMonth = lastMonthDate.toLocaleString("en", { month: "long" });
  const ptLastMonth = lastMonthDate.toLocaleString("pt", { month: "long" });

  const enPrevLastMonth = prevLastMonthDate.toLocaleString("en", {
    month: "long",
  });
  const ptPrevLastMonth = prevLastMonthDate.toLocaleString("pt", {
    month: "long",
  });

  return {
    enThisMonth,
    ptThisMonth,
    enLastMonth,
    ptLastMonth,
    enPrevLastMonth,
    ptPrevLastMonth,
  };
};
