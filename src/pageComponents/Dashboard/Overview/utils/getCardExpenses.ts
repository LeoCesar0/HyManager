import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { ExpensesCardProps } from "../components/Cards/ExpensesCard";

export const getCardExpenses = (summary: DashboardSummary | null) => {
  const thisWeek = valueToCurrency(summary?.["7"]?.totalExpenses || 0);
  const thisMonth = valueToCurrency(summary?.["30"]?.totalExpenses || 0);
  const lastMonth = valueToCurrency(summary?.["60"]?.totalExpenses || 0);

  const expensesCards: ExpensesCardProps[] = [
    {
      title: {
        pt: "Gastos",
        en: "Expenses",
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
            pt: "Esse mês",
            en: "This month",
          },
        },
        {
          value: lastMonth,
          title: {
            pt: "Último Mês",
            en: "Last month",
          },
        },
      ],
    },
  ];

  return expensesCards;
};
