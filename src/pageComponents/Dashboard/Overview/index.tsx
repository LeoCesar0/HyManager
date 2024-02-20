import { Section, SectionContainer } from "../../../components/Section/Section";
import BalanceChart from "./components/BalanceChart";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard, GoalCardProps } from "./components/Cards/GoalCard";
import {
  ExpensesCardProps,
  ExpensesCard,
} from "./components/Cards/ExpensesCard";
import { useEffect, useState } from "react";
import {
  calculateDashboardSummary,
  DashboardSummary,
} from "@/server/utils/calculateDashboardSummary";
import { getCardExpenses } from "./utils/getCardExpenses";
import { startOfMonth, startOfWeek } from "date-fns";
import differenceInDays from "date-fns/differenceInDays";

const getBreakPoints = () => {
  const today = new Date();
  const startOfThisWeek = startOfWeek(today);
  const startOfThisMonth = startOfMonth(today);
  const startLastMonth = startOfMonth(startOfThisMonth);

  const weekBreakPoint = differenceInDays(today, startOfThisWeek);
  const monthBreakPoint = differenceInDays(today, startOfThisMonth);
  const lastMonthBreakPoint = differenceInDays(today, startOfMonth(startOfThisMonth));

};

export const DashboardOverView = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const [summary, setSummary] = useState<null | DashboardSummary>(null);

  useEffect(() => {
    if (currentBankAccount?.id) {
      calculateDashboardSummary({
        bankAccountId: currentBankAccount.id,
        dateBreakPoints: [7, 30, 60],
      }).then((result) => {
        console.log("result", result);
        setSummary(result);
      });
    }
  }, [currentBankAccount?.id]);

  const expensesCards = getCardExpenses(summary);

  return (
    <SectionContainer>
      <Section sectionTitle={{ en: "Overview", pt: "Geral" }}>
        <div className="flex gap-3 flex-wrap">
          <BalanceCard />
          {expensesCards.map((card, index) => {
            return <ExpensesCard key={`${card.title.en}-${index}`} {...card} />;
          })}
          {goalCards.map((card, index) => {
            return <GoalCard key={`${card.title.en}-${index}`} {...card} />;
          })}
        </div>
      </Section>
      <Section sectionTitle={{ en: "Charts", pt: "Gráficos" }}>
        <BalanceChart bankAccountId={currentBankAccount!.id} />
      </Section>
    </SectionContainer>
  );
};

export const goalCards: GoalCardProps[] = [
  {
    title: {
      pt: "Meta de economia",
      en: "Saving goals",
    },
    strong: {
      pt: "esse anterior",
      en: "this month",
    },
    slider: {
      from: 0,
      current: 1658,
      to: 3500,
    },
  },
  {
    title: {
      pt: "Meta de economia",
      en: "Saving goals",
    },
    strong: {
      pt: "mês anterior",
      en: "last month",
    },
    slider: {
      from: 0,
      current: 3298,
      to: 3500,
    },
  },
];
