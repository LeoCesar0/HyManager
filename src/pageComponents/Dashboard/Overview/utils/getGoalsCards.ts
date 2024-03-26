import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { valueToCurrency } from "@/utils/misc";
import { sub } from "date-fns";
import { capitalizeString } from "../../../../utils/capitalizeString";
import { GoalCardProps } from "../components/Cards/GoalCard";
import { ExpenseGoal } from "../../../../@types/Goals";
import { getMonthLabels } from "./getMonthLabels";

type IGetGoalsCards = {
  summary: DashboardSummary | null;
  goals: ExpenseGoal;
};

export const getGoalsCards = ({ goals, summary }: IGetGoalsCards) => {
  if(!summary) return []

  const { enLastMonth, enThisMonth, ptLastMonth, ptThisMonth } =
    getMonthLabels();

  const goalCards: GoalCardProps[] = [
    {
      title: {
        pt: "Meta de economia",
        en: "Saving goals",
      },
      strong: {
        pt: ptThisMonth,
        en: enThisMonth,
      },
      slider: {
        from: 0,
        current: Math.abs(summary['this-month'].totalExpenses),
        to: goals.maxExpenses,
      },
    },
    {
      title: {
        pt: "Meta de economia",
        en: "Saving goals",
      },
      strong: {
        pt: ptLastMonth,
        en: enLastMonth,
      },
      slider: {
        from: 0,
        current: Math.abs(summary['last-month'].totalExpenses),
        to: goals.maxExpenses,
      },
    },
  ];

  return goalCards;
};
