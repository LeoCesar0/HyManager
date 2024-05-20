import { useMemo } from "react";
import { makeCategoriesChart } from "./controller";
import { TransactionReport } from "@/server/models/TransactionReport/schema";
import useT from "@/hooks/useT";
import { sub } from "date-fns";
import { capitalizeString } from "@/utils/capitalizeString";
import { PieChart } from "@/components/Charts/PieChart";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { getCurrentBankCategories } from "@/utils/getCurrentBankCategories";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BankCreditor } from "@/server/models/BankCreditor/schema";

type Props = {
  transactionReports: TransactionReport[];
  creditors: BankCreditor[];
};

export const CategoriesChart: React.FC<Props> = ({
  transactionReports,
  creditors,
}) => {
  const { overviewConfig, currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const startDate = overviewConfig.earliestBreakPoint.start;

  const enMonth = startDate.toLocaleString("en", { month: "long" });
  const ptMonth = startDate.toLocaleString("pt", { month: "long" });

  const title = useT({
    pt: `Por categoria`,
    en: `Per category`,
  });

  const categories = useMemo(() => {
    return getCurrentBankCategories({
      currentBankAccount,
      currentLanguage,
    });
  }, [currentBankAccount, currentLanguage]);

  const { series, options } = useMemo(() => {
    return makeCategoriesChart({
      transactionReports,
      title,
      categories,
      creditors,
    });
  }, [categories, title, transactionReports, creditors]);

  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <PieChart options={options} series={series} />
      )}
    </div>
  );
};
