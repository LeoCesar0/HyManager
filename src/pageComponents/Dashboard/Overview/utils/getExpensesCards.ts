import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { ExpensesCardProps } from "../components/Cards/ExpensesCard";
import { capitalizeString } from "../../../../utils/capitalizeString";
import { getMonthLabels } from "./getMonthLabels";

export const getExpensesCards = (summary: DashboardSummary | null) => {
  const thisWeek = valueToCurrency(summary?.["this-week"]?.totalExpenses || 0);
  const thisMonth = valueToCurrency(
    summary?.["this-month"]?.totalExpenses || 0
  );
  const lastMonth = valueToCurrency(
    summary?.["last-month"]?.totalExpenses || 0
  );

  const { enLastMonth, enThisMonth, ptLastMonth, ptThisMonth } =
    getMonthLabels();

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
