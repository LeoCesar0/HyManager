import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { ExpensesCardProps } from "../components/Cards/ExpensesCard";
import { capitalizeString } from "../../../../utils/capitalizeString";
import { getMonthLabels } from "./getMonthLabels";

export const getExpensesCards = (summary: DashboardSummary | null) => {
  const prevLastMonth = valueToCurrency(
    summary?.prevLastMonth?.totalExpenses || 0
  );
  const thisMonth = valueToCurrency(summary?.thisMonth?.totalExpenses || 0);
  const lastMonth = valueToCurrency(summary?.lastMonth?.totalExpenses || 0);

  const {
    enLastMonth,
    enThisMonth,
    ptLastMonth,
    ptThisMonth,
    enPrevLastMonth,
    ptPrevLastMonth,
  } = getMonthLabels();

  const expensesCards: ExpensesCardProps[] = [
    {
      title: {
        pt: "Gastos Recentes",
        en: "Recent Expenses",
      },
      values: [
        {
          value: prevLastMonth,
          title: {
            pt: capitalizeString(ptPrevLastMonth),
            en: capitalizeString(enPrevLastMonth),
          },
        },
        {
          value: lastMonth,
          title: {
            pt: capitalizeString(ptLastMonth),
            en: capitalizeString(enLastMonth),
          },
        },

        {
          value: thisMonth,
          title: {
            pt: capitalizeString(ptThisMonth),
            en: capitalizeString(enThisMonth),
          },
        },
      ],
    },
  ];

  return expensesCards;
};
