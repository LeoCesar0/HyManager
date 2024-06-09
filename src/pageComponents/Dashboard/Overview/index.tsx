import { Section, SectionContainer } from "../../../components/Section/Section";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard } from "./components/Cards/GoalCard";
import { AmountCard } from "./components/Cards/AmountCard";
import { useEffect, useState } from "react";
import { getAmountCards } from "./utils/getAmountCards";
import {
  DashboardOverviewData,
  getDashboardOverviewData,
} from "./utils/getDashboardOverviewData";
import ExpensesChart from "./components/ExpensesChart";
import { getGoalsCards } from "./utils/getGoalsCards";
import { CategoriesChart } from "./components/CategoriesChart";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import { listBankCreditors } from "@/server/models/BankCreditor/read/listBankCreditors";
import {
  Transaction,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { listTransactionsByBankId } from "@/server/models/Transaction/read/listTransactionsByBankId";

export const DashboardOverView = () => {
  const { currentBankAccount, overviewConfig } = useGlobalDashboardStore();
  const [overviewData, setOverviewData] =
    useState<null | DashboardOverviewData>(null);
  const bankAccountId = currentBankAccount?.id || "";
  const [creditors, setCreditors] = useState<BankCreditor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const lastTransaction =
    transactions.length > 0 ? transactions[transactions.length - 1] : null;
  const balance = lastTransaction?.updatedBalance || 0;

  // --------------------------
  // SUMMARY / EXPENSES
  // --------------------------

  const { dateBreakPoints, earliestBreakPoint } = overviewConfig;

  useEffect(() => {
    if (bankAccountId && dateBreakPoints.length > 0) {
      listTransactionsByBankId({
        id: bankAccountId,
        filters: [
          { field: "date", operator: ">=", value: earliestBreakPoint.start },
        ],
      }).then((result) => {
        const trans = result.data || [];
        trans.sort((a, b) => a.date.seconds - b.date.seconds);
        setTransactions(trans);
        // --------------------------
        // OVERVIEW DATA
        // --------------------------
        getDashboardOverviewData({
          bankAccountId: bankAccountId,
          overviewConfig: {
            dateBreakPoints,
            earliestBreakPoint,
          },
          transactions: trans,
        }).then((result) => {
          setOverviewData(result);
        });
      });
    }
  }, [bankAccountId, dateBreakPoints, earliestBreakPoint]);

  const summary = overviewData?.dashboardSummary || null;

  const amountCards = getAmountCards(summary);

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
          {amountCards.map((card, index) => {
            return <AmountCard key={`${card.title.en}-${index}`} {...card} />;
          })}
          {goalCards.map((card, index) => {
            return <GoalCard key={`${card.title.en}-${index}`} {...card} />;
          })}
        </div>
      </Section>
      <Section sectionTitle={{ en: "Charts", pt: "Gráficos" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {overviewData && creditors.length > 0 && (
            <CategoriesChart
              transactions={transactions}
              type={TransactionType.debit}
            />
          )}
          {overviewData && creditors.length > 0 && (
            <CategoriesChart
              transactions={transactions}
              type={TransactionType.deposit}
            />
          )}
        </div>
        {overviewData && <ExpensesChart transactions={transactions} />}
        {/* <BalanceChart bankAccountId={currentBankAccount!.id} /> */}
      </Section>
    </SectionContainer>
  );
};
