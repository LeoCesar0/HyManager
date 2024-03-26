import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { sub } from "date-fns";
import { ExpensesCardProps } from "../components/Cards/ExpensesCard";
import { capitalizeString } from '../../../../utils/capitalizeString';

export const getCardExpenses = (summary: DashboardSummary | null) => {

  const thisWeek = valueToCurrency(summary?.["this-week"]?.totalExpenses || 0);
  const thisMonth = valueToCurrency(summary?.["this-month"]?.totalExpenses || 0);
  const lastMonth = valueToCurrency(summary?.["last-month"]?.totalExpenses || 0);

  const now = new Date()
  const lastMonthDate = sub(now, { months: 1 });

  const enThisMonth = now.toLocaleString("en", { month: "long" });
  const ptThisMonth = now.toLocaleString("pt", { month: "long" });

  const enLastMonth = lastMonthDate.toLocaleString("en", { month: "long" });
  const ptLastMonth = lastMonthDate.toLocaleString("pt", { month: "long" });

  // const last7 = valueToCurrency(summary?.["last-7"]?.totalExpenses || 0);
  // const last30 = valueToCurrency(summary?.["last-30"]?.totalExpenses || 0);
  // const last60 = valueToCurrency(summary?.["last-60"]?.totalExpenses || 0);

  const expensesCards: ExpensesCardProps[] = [
    {
      title: {
        pt: "Gastos Recentes",
        en: "Recent Expenses",
      },
      values: [
        {
          value: thisWeek,
          title: {
            pt: "Essa semana",
            en: "This Week",
          },
        },
        {
          value: thisMonth,
          title: {
            pt: capitalizeString(ptThisMonth),
            en: capitalizeString(enThisMonth),
          },
        },
        {
          value: lastMonth,
          title: {
            pt: capitalizeString(ptLastMonth),
            en: capitalizeString(enLastMonth),
          },
        },
      ],
    },
  ];

  return expensesCards;
};
