import { Section, SectionContainer } from "../../../components/Section/Section";
import BalanceChart from "./components/BalanceChart";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard, GoalCardProps } from "./components/Cards/GoalCard";
import {
  ExpensesCardProps,
  ExpensesCard,
} from "./components/Cards/ExpensesCard";

export const DashboardOverView = () => {
  const { currentBankAccount } = useGlobalDashboardStore();

  return (
    <SectionContainer>
      <Section sectionTitle={{ en: "Overview", pt: "Geral" }}>
        <div className="flex gap-3 flex-wrap">
          <BalanceCard />
          {expensesCards.map((card) => {
            return <ExpensesCard key={card.title.en} {...card} />;
          })}
          {goalCards.map((card) => {
            return <GoalCard key={card.title.en} {...card} />;
          })}
        </div>
      </Section>
      <Section sectionTitle={{ en: "Charts", pt: "Gráficos" }}>
        <BalanceChart bankAccountId={currentBankAccount!.id} />
      </Section>
    </SectionContainer>
  );
};
export const expensesCards: ExpensesCardProps[] = [
  {
    title: {
      pt: "Gastos",
      en: "Expenses",
    },
    values: [
      {
        value: "R$110,00",
        title: {
          pt: "Essa semana",
          en: "This Week",
        },
      },
      {
        value: "R$268,00",
        title: {
          pt: "Esse mês",
          en: "This month",
        },
      },
      {
        value: "R$3250,50",
        title: {
          pt: "Último Mês",
          en: "Last month",
        },
      },
    ],
  },
];

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
