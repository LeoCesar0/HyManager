import { useMemo } from "react";
import { makeExpensesChartData } from "./controller";
import { BarChart } from "@/components/Charts/BarChart/index";
import { TransactionReport } from "@/server/models/TransactionReport/schema";
import useT from "@/hooks/useT";
import { sub } from "date-fns";
import { capitalizeString } from "@/utils/capitalizeString";

interface IExpensesChart {
  transactionReports: TransactionReport[];
}

const ExpensesChart: React.FC<IExpensesChart> = ({ transactionReports }) => {
  const now = new Date()
  const startDate = sub(now, { months: 1 });

  const enMonth = startDate.toLocaleString("en", { month: "long" });
  const ptMonth = startDate.toLocaleString("pt", { month: "long" });

  const title = useT({
    en: `Expenses since last ${capitalizeString(enMonth)}`,
    pt: `Gastos desde ${capitalizeString(ptMonth)}`
  });

  const { series, options } = useMemo(() => {
    return makeExpensesChartData({
      transactionReports,
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
