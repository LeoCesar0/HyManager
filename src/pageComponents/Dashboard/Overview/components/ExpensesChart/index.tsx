import { useMemo } from "react";
import { makeExpensesChartData } from "./controller";
import { BarChart } from "@/components/Charts/BarChart/index";
import useT from "@/hooks/useT";
import { capitalizeString } from "@/utils/capitalizeString";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { Transaction } from "@/server/models/Transaction/schema";

interface IExpensesChart {
  transactions: Transaction[];
}

const ExpensesChart: React.FC<IExpensesChart> = ({ transactions }) => {
  const { overviewConfig } = useGlobalDashboardStore();
  const startDate = overviewConfig.earliestBreakPoint.start;

  const enMonth = startDate.toLocaleString("en", { month: "long" });
  const ptMonth = startDate.toLocaleString("pt", { month: "long" });

  const title = useT({
    en: `Expenses since last ${capitalizeString(enMonth)}`,
    pt: `Gastos desde ${capitalizeString(ptMonth)}`,
  });

  const { series, options } = useMemo(() => {
    return makeExpensesChartData({
      transactions,
      title,
    });
  }, []);

  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <>
          <BarChart options={options} series={series} />
        </>
      )}
    </div>
  );
};

export default ExpensesChart;
