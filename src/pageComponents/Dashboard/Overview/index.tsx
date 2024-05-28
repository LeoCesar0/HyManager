import { Section, SectionContainer } from "../../../components/Section/Section";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard } from "./components/Cards/GoalCard";
import { ExpensesCard } from "./components/Cards/ExpensesCard";
import { useEffect, useState } from "react";
import { getExpensesCards } from "./utils/getExpensesCards";
import {
  DashboardOverviewData,
  getDashboardOverviewData,
} from "./utils/getDashboardOverviewData";
import ExpensesChart from "./components/ExpensesChart";
import { getGoalsCards } from "./utils/getGoalsCards";
import { CategoriesChart } from "./components/CategoriesChart";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import { listBankCreditors } from "@/server/models/BankCreditor/read/listBankCreditors";
import { Transaction } from "@/server/models/Transaction/schema";
import { listTransactionsByBankId } from "@/server/models/Transaction/read/listTransactionsByBankId";

export const DashboardOverView = () => {
  const { currentBankAccount, overviewConfig } = useGlobalDashboardStore();
  const [overviewData, setOverviewData] =
    useState<null | DashboardOverviewData>(null);
  const bankAccountId = currentBankAccount?.id || "";
  const [creditors, setCreditors] = useState<BankCreditor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  const { dateBreakPoints, earliestBreakPoint } = overviewConfig;

  useEffect(() => {
    if (bankAccountId && dateBreakPoints.length > 0) {
      getDashboardOverviewData({
        bankAccountId: bankAccountId,
        overviewConfig: {
          dateBreakPoints,
          earliestBreakPoint,
        },
      }).then((result) => {
        setOverviewData(result);
      });
    }
    if (bankAccountId && dateBreakPoints.length > 0) {
      listTransactionsByBankId({
        id: bankAccountId,
        filters: [
          { field: "date", operator: ">=", value: earliestBreakPoint.start },
        ],
      }).then((result) => {
        if (result.data) {
          setTransactions(result.data);
        }
      });
    }
  }, [bankAccountId, dateBreakPoints, earliestBreakPoint]);

  const summary = overviewData?.dashboardSummary || null;

  const expensesCards = getExpensesCards(summary);

  // TODO change maxExpenses GOAL
  const goalCards = getGoalsCards({
    goals: {
      maxExpenses: 4900,
    },
    summary: summary,
  });

  useEffect(() => {
    listBankCreditors({
      bankAccountId,
    }).then((res) => {
      setCreditors(res.data ?? []);
    });
  }, [bankAccountId]);

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
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {overviewData && creditors.length > 0 && (
            <CategoriesChart
              transactions={transactions}
              creditors={creditors}
            />
          )}
        </div>
        {overviewData && (
          <ExpensesChart transactionReports={overviewData.transactionReports} />
        )}

        {/* <BalanceChart bankAccountId={currentBankAccount!.id} /> */}
      </Section>
    </SectionContainer>
  );
};
