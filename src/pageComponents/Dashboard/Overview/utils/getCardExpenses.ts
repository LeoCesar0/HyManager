import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { ExpensesCardProps } from "../components/Cards/ExpensesCard";

export const getCardExpenses = (summary: DashboardSummary | null) => {

  const thisWeek = valueToCurrency(summary?.["this-week"]?.totalExpenses || 0);
  const thisMonth = valueToCurrency(summary?.["this-month"]?.totalExpenses || 0);
  const lastMonth = valueToCurrency(summary?.["last-month"]?.totalExpenses || 0);

  const last7 = valueToCurrency(summary?.["last-7"]?.totalExpenses || 0);
  const last30 = valueToCurrency(summary?.["last-30"]?.totalExpenses || 0);
  const last60 = valueToCurrency(summary?.["last-60"]?.totalExpenses || 0);

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
    {
      title: {
        pt: "Gastos",
        en: "Expenses",
      },
      values: [
        {
          value: last7,
          title: {
            pt: "Últimos 7 dias",
            en: "Last 7 days",
          },
        },
        {
          value: last30,
          title: {
            pt: "Últimos 30 dias",
            en: "Last 30 days",
          },
        },
        {
          value: last60,
          title: {
            pt: "Últimos 60 dias",
            en: "Last 60 days",
          },
        },
      ],
    },
  ];

  return expensesCards;
};
