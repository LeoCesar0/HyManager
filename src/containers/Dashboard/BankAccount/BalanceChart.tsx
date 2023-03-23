import { TransactionType } from "@graphql-folder/generated";
import { Transaction } from "@types-folder/models/Transaction";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";
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
        // const date = new Date(entry.date).toLocaleDateString();
        const date = entry.date;
        const type = entry.type;
        let amount = entry.amount / 100;
        amount = Number(amount.toFixed(2));
        amount = type === TransactionType.Debit ? -amount : amount;
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
      colors: PRIMARY_COLORS,

      // labels: dates,
      markers: {
        size: 4,
        colors: PRIMARY_COLORS,
      },
      xaxis: {
        categories: dates,
        type: "datetime",
        labels: {
          style: {
            colors: "#393939",
          },
        },
      },
      yaxis: {
        decimalsInFloat: 2,
      },
      title: {
        text: "Balance Chart",
      },
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
