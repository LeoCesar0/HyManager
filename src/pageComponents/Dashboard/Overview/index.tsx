import { Section, SectionContainer } from "../../../components/Section/Section";
import { HiCurrencyDollar, HiTrendingDown } from "react-icons/hi";
import { TargetIcon } from "@radix-ui/react-icons";
import { IOverviewCard, OverviewCard } from "./components/OverviewCard";
import BalanceChart from "./components/BalanceChart";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { useGlobalDashboardStore } from '../../../contexts/GlobalDashboardStore';

export const DashboardOverView = () => {
  const { currentBankAccount } = useGlobalDashboardStore();

  return (
    <SectionContainer>
      <Section sectionTitle={{ en: "Overview", pt: "Geral" }}>
        <div className="flex gap-3 flex-wrap">
          {cards.map((card) => {
            return <OverviewCard key={card.id} {...card} />;
          })}
        </div>
      </Section>
      <Section sectionTitle={{ en: "Charts", pt: "Gráficos" }}>
        <BalanceChart bankAccountId={currentBankAccount!.id} />
      </Section>
    </SectionContainer>
  );
};

const cards: IOverviewCard[] = [
  {
    id: "total-balance",
    title: {
      pt: "Balanço Total",
      en: "Total Balance",
    },
    Icon: HiCurrencyDollar,
    value: "R$ 1.200,00",
  },
  {
    id: "expenses",
    title: {
      pt: "Gastos",
      en: "Expenses",
    },
    Icon: HiTrendingDown,
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
  {
    id: "saving-goals",
    title: {
      pt: "Meta de economia",
      en: "Saving goals",
    },
    strong: {
      pt: "esse anterior",
      en: "this month",
    },
    Icon: TargetIcon,
    slider: {
      from: 0,
      current: 1658,
      to: 3500,
    },
  },
  {
    id: "saving-goals-last-month",
    title: {
      pt: "Meta de economia",
      en: "Saving goals",
    },
    strong: {
      pt: "mês anterior",
      en: "last month",
    },
    Icon: TargetIcon,
    slider: {
      from: 0,
      current: 3298,
      to: 3500,
    },
  },
];
