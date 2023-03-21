import { TransactionType } from "@graphql-folder/generated";
import { Transaction } from "@types-folder/models/Transaction";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { TAILWIND_CONFIG } from "src/static/config";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const COLORS = TAILWIND_CONFIG.theme?.colors;
const primaryColors = [COLORS!.primary, COLORS!.secondary] as string[];



interface ITransactionsChart {
  transactions: Transaction[];
  type: Transaction["type"];
}

export const TransactionsChart: React.FC<ITransactionsChart> = ({
  transactions,
  type = TransactionType.Credit,
}) => {
  const colors = type === "credit" ? [COLORS!.credit] : [COLORS!.debit];

  const defaultOptions: ApexOptions = {
    colors: primaryColors,
    xaxis: {
      labels: {
        style: {
          colors: "#393939",
        },
      },
    },
    title: {
      text: type === TransactionType.Credit ? 'Credit' : 'Debit'
    }
  };

  const { series, options } = useMemo(() => {
    const filteredTransactions = transactions.filter(
      (item) => item.type === type
    );
    const amounts = filteredTransactions.map((item) => item.amount / 100);
    const labels = filteredTransactions.map((item) =>
      new Date(item.date).toLocaleDateString()
    );
    // console.log("type -->", type);
    // console.log("filteredTransactions -->", filteredTransactions);
    // console.log("amounts -->", amounts);
    // console.log("labels -->", labels);
    // console.log("-------------------------------");

    const series_ = [
      {
        name: `transactions-${type}`,
        data: [...amounts],
      },
    ];

    return {
      series: series_,
      options: {
        ...defaultOptions,
        labels: labels,
        colors: colors,
      },
    };
  }, [transactions]);

  return (
    <div className="bg-surface flex-1 shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <Chart options={options} series={series} type="bar" width="100%" />
      )}
    </div>
  );
};

export default TransactionsChart;
