import { Section, SectionContainer } from "../../../components/Section/Section";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard } from "./components/Cards/GoalCard";
import { ExpensesCard } from "./components/Cards/ExpensesCard";
import { useEffect, useMemo, useState } from "react";
import { getExpensesCards } from "./utils/getExpensesCards";
import { getDateBreakPoints } from "./utils/getDateBreakPoints";
import {
  DashboardOverviewData,
  getDashboardOverviewData,
} from "./utils/getDashboardOverviewData";
import ExpensesChart from "./components/ExpensesChart";
import { getGoalsCards } from "./utils/getGoalsCards";

export const DashboardOverView = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const [overviewData, setOverviewData] =
    useState<null | DashboardOverviewData>(null);
  const bankAccountId = currentBankAccount?.id || "";

  // --------------------------
  // LAST REPORTS
  // --------------------------

  const lastReport = overviewData?.transactionReports
    ? overviewData.transactionReports[
        overviewData.transactionReports.length - 1
      ]
    : null;
  const balance = lastReport?.finalBalance || 0;

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
        setOverviewData(result);
      });
    }
  }, [bankAccountId, breakPoints]);

  const summary = overviewData?.dashboardSummary || null;

  const expensesCards = getExpensesCards(summary);

  // --------------------------
  // TRANSACTIONS REPORT
  // --------------------------

  // TODO change maxExpenses
  const goalCards = getGoalsCards({
    goals: {
      maxExpenses: 4900,
    },
    summary: summary,
  });

  return (
    <SectionContainer>
      <Section sectionTitle={{ en: "Overview", pt: "Geral" }}>
        <div className="flex gap-3 flex-wrap">
          <BalanceCard balance={balance} />
          {expensesCards.map((card, index) => {
            return <ExpensesCard key={`${card.title.en}-${index}`} {...card} />;
          })}
          {goalCards.map((card, index) => {
            return <GoalCard key={`${card.title.en}-${index}`} {...card} />;
          })}
        </div>
      </Section>
      <Section sectionTitle={{ en: "Charts", pt: "Gráficos" }}>
        {overviewData && (
          <ExpensesChart transactionReports={overviewData.transactionReports} />
        )}
        {/* <BalanceChart bankAccountId={currentBankAccount!.id} /> */}
      </Section>
    </SectionContainer>
  );
};
