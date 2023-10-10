import { Section } from "./components/Section";
import { HiCurrencyDollar, HiTrendingDown } from "react-icons/hi";
import { TargetIcon } from "@radix-ui/react-icons";
import { IOverviewCard, OverviewCard } from "./components/OverviewCard";

const Dashboard = () => {
  return (
    <>
      <Section sectionTitle="Geral" className="">
        <div className="flex gap-3 flex-wrap">
          {cards.map((card) => {
            return <OverviewCard key={card.id} {...card} />;
          })}
        </div>
      </Section>
    </>
  );
};

export default Dashboard;

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
    Icon: TargetIcon,
    slider: {
      from: 0,
      current: 1658,
      to: 3500,
    },
  },
];
