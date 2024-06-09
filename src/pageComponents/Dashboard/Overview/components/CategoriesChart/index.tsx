import { useMemo } from "react";
import { makeCategoriesChart } from "./controller";
import useT from "@/hooks/useT";
import { PieChart } from "@/components/Charts/PieChart";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { getCurrentBankCategories } from "@/utils/getCurrentBankCategories";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import {
  Transaction,
  TransactionType,
} from "@/server/models/Transaction/schema";
import selectT from "@/utils/selectT";

type Props = {
  transactions: Transaction[];
  type: TransactionType;
};

export const CategoriesChart: React.FC<Props> = ({ transactions, type }) => {
  const { overviewConfig, currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();

  const startDate = overviewConfig.earliestBreakPoint.start;
  const enMonth = startDate.toLocaleString("en", { month: "long" });
  const ptMonth = startDate.toLocaleString("pt", { month: "long" });

  const categories = useMemo(() => {
    return getCurrentBankCategories({
      currentBankAccount,
      currentLanguage,
    });
  }, [currentBankAccount, currentLanguage]);

  const { series, options } = useMemo(() => {
    const debitTitle = selectT(currentLanguage, {
      pt: `Despesas por categoria, desde ${ptMonth}`,
      en: `Debits per category, since ${enMonth}`,
    });

    const depositTitle = selectT(currentLanguage, {
      pt: `Receita por categoria, desde ${ptMonth}`,
      en: `Deposits per category, since ${enMonth}`,
    });

    return makeCategoriesChart({
      transactions,
      title: type === TransactionType.debit ? debitTitle : depositTitle,
      categories,
      type,
    });
  }, [categories, transactions]);

  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <PieChart options={options} series={series} />
      )}
    </div>
  );
};
