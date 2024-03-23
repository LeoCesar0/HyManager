import { Section, SectionContainer } from "../../../components/Section/Section";
import BalanceChart from "./components/BalanceChart";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard, GoalCardProps } from "./components/Cards/GoalCard";
import { ExpensesCard } from "./components/Cards/ExpensesCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardSummary } from "@/server/utils/calculateDashboardSummary";
import { getCardExpenses } from "./utils/getCardExpenses";
import { getDateBreakPoints } from "./utils/getDateBreakPoints";
import { DashboardOverviewData, getDashboardOverviewData } from "./utils/getDashboardOverviewData";
import { BarChart } from "../../../components/Charts/BarChart";
import ExpensesChart from "./components/ExpensesChart";
import { sub, startOfMonth } from 'date-fns';
import { listTransactionReportsBy } from '../../../server/models/TransactionReport/read/listTransactionReportBy';
import useFetcher from "@/hooks/useFetcher";
import { TransactionReport } from '../../../server/models/TransactionReport/schema';
import { FirebaseCollection } from '../../../server/firebase/index';
import { FirebaseFilterFor } from "@/@types";

export const DashboardOverView = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const [overviewData, setOverviewData] = useState<null | DashboardOverviewData>(null);

  const bankAccountId = currentBankAccount?.id || ''

  // --------------------------
  // SUMMARY / EXPENSES
  // --------------------------

  const breakPoints = useMemo(() => getDateBreakPoints(), []);

  useEffect(() => {
    if (bankAccountId && breakPoints.length > 0) {
      getDashboardOverviewData({
        bankAccountId: bankAccountId,
        dateBreakPoints: breakPoints,
      }).then((result) => {
        setOverviewData(result)
      });
    }
  }, [bankAccountId, breakPoints]);

  const summary = overviewData?.dashboardSummary || null

  const expensesCards = getCardExpenses(summary);

  // --------------------------
  // TRANSACTIONS REPORT 
  // --------------------------
  
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
        {overviewData && <ExpensesChart transactionReports={overviewData.transactionReports} />}
        {/* <BalanceChart bankAccountId={currentBankAccount!.id} /> */}
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
      pt: "esse mês",
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
