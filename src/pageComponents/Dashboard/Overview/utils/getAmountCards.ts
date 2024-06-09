import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { AmountCardProps } from "../components/Cards/AmountCard";
import { capitalizeString } from "../../../../utils/capitalizeString";
import { getMonthLabels } from "./getMonthLabels";

const format = (value: number) => valueToCurrency(Math.abs(value));

export const getAmountCards = (summary: DashboardSummary | null) => {
  const prevLastMonth = format(summary?.prevLastMonth?.totalExpenses || 0);
  const thisMonth = format(summary?.thisMonth?.totalExpenses || 0);
  const lastMonth = format(summary?.lastMonth?.totalExpenses || 0);

  const prevLastMonthDeposit = format(
    summary?.prevLastMonth?.totalDeposits || 0
  );
  const thisMonthDeposit = format(summary?.thisMonth?.totalDeposits || 0);
  const lastMonthDeposit = format(summary?.lastMonth?.totalDeposits || 0);

  const title = {
    pt: "Gastos Recentes",
    en: "Recent Expenses",
  };

  const titleDeposit = {
    pt: "Receitas",
    en: "Income",
  };

  const {
    enLastMonth,
    enThisMonth,
    ptLastMonth,
    ptThisMonth,
    enPrevLastMonth,
    ptPrevLastMonth,
  } = getMonthLabels();

  const expensesCards: AmountCardProps[] = [
    {
      type: "expenses",
      title: title,
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
    {
      type: "deposits",
      title: titleDeposit,
      values: [
        {
          value: prevLastMonthDeposit,
          title: {
            pt: capitalizeString(ptPrevLastMonth),
            en: capitalizeString(enPrevLastMonth),
          },
        },
        {
          value: lastMonthDeposit,
          title: {
            pt: capitalizeString(ptLastMonth),
            en: capitalizeString(enLastMonth),
          },
        },

        {
          value: thisMonthDeposit,
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
