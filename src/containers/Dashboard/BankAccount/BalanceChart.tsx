import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Transaction, TransactionType } from "src/models/Transaction/schema";
import { APEX_DEFAULT_OPTIONS, PRIMARY_COLORS } from "src/static/config";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IBalanceChart {
  transactions: Transaction[];
}

export const BalanceChart: React.FC<IBalanceChart> = ({ transactions }) => {
  //

  const { series, options } = useMemo(() => {
    const { dates, balances } = transactions.reduce(
      (acc, entry) => {
        const date = new Date(entry.date.seconds).toLocaleDateString();
        const type = entry.type;
        let amount = entry.amount / 100;
        amount = type === TransactionType.debit ? -amount : amount;
        const prevBalance = acc.balances.at(-1) || 0;

        // console.log("prevBalance -->", prevBalance);
        // console.log("amount -->", amount);
        // console.log("type -->", type);

        acc.balances = [...acc.balances, prevBalance + amount];
        acc.dates = [...acc.dates, date];

        // console.log("acc.balances -->", acc.balances);
        // console.log("------------------------");

        return acc;
      },
      {
        dates: [],
        balances: [],
      } as {
        dates: string[];
        balances: number[];
      }
    );

    const options_: ApexOptions = {
      ...APEX_DEFAULT_OPTIONS,
      // labels: dates,
      markers: {
        size: 4,
        colors: PRIMARY_COLORS,
      },
      xaxis:{
        categories: dates
      },
      title: {
        text:'Balance Chart'
      }
    };

    return {
      series: [
        {
          name: "balance",
          data: balances,
        },
      ],
      options: options_,
    };
  }, [transactions]);

  // console.log('options -->', options)
  // console.log('series -->', series)

  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <Chart
          options={options}
          series={series}
          type="line"
          height="350"
          width="100%"
        />
      )}
    </div>
  );
};

export default BalanceChart;
