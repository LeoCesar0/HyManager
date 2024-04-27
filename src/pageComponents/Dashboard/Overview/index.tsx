import { Section, SectionContainer } from "../../../components/Section/Section";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { BalanceCard } from "./components/Cards/BalanceCard";
import { GoalCard, GoalCardProps } from "./components/Cards/GoalCard";
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
import { TransactionReport } from "@/server/models/TransactionReport/schema";
import { listTransactionReportsBy } from "@/server/models/TransactionReport/read/listTransactionReportBy";
import { startOfMonth, sub } from "date-fns";

const getLast3Reports = async ({
  bankAccountId,
  type,
}: {
  bankAccountId: string;
  type: TransactionReport["type"];
}) => {
  const today = new Date();
  const start = startOfMonth(sub(today, { months: 2 }));
  const response = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: type,
    filters: [{ field: "date", operator: ">=", value: start }],
  });
  const reports = response.data || [];
  return reports;
};

export const DashboardOverView = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const [overviewData, setOverviewData] =
    useState<null | DashboardOverviewData>(null);
  const [last3MonthReports, setLast3MonthReports] = useState<
    TransactionReport[]
  >([]);

  const bankAccountId = currentBankAccount?.id || "";

  // --------------------------
  // LAST REPORTS
  // --------------------------

  //3895

  useEffect(() => {
    getLast3Reports({ bankAccountId, type: "day" }).then((data) => {
      console.log("data", data);
      setLast3MonthReports(data);
    });
  }, []);

  const lastReport = last3MonthReports[last3MonthReports.length - 1] || null;
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
        console.log("result", result);
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
