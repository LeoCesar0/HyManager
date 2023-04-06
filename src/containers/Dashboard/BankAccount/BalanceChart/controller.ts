import { ApexOptions } from "apexcharts";
import currency from "currency.js";
import { Transaction, TransactionType } from "src/models/Transaction/schema";
import {
  APEX_DEFAULT_OPTIONS,
  APEX_LOCALES,
  PRIMARY_COLORS,
} from "src/static/config";
import {
  formatAnyDate,
  timestampToDate,
  valueToCurrency,
} from "src/utils/misc";

export interface IFilterDate {
  label: string;
  format: string;
  field: keyof Transaction;
}

export const dateOptions: IFilterDate[] = [
  {
    label: "Today",
    format: "dd",
    field: "dateDay",
  },
  {
    label: "Week",
    format: "Q",
    field: "dateWeek",
  },
  {
    label: "Month",
    format: "MM",
    field: "dateMonth",
  },
  {
    label: "Year",
    format: "yyyy",
    field: "dateYear",
  },
];

export const makeBalanceChartData = ({ transactions }: { transactions: Transaction[] }) => {
  const { dates, balances } = transactions.reduce(
    (acc, entry) => {
      const date = timestampToDate(entry.date).getTime();
      const type = entry.type;
      let amount = Math.abs(entry.amount);
      amount = type === TransactionType.debit ? -amount : amount;
      const prevBalance = acc.balances.at(-1) || 0;
      const currentBalance = currency(prevBalance).add(amount).value;

      if (acc.dates.length === 0) console.log("---- START -----");

      acc.balances = [...acc.balances, currentBalance];
      acc.dates = [...acc.dates, date];

      return acc;
    },
    {
      dates: [],
      balances: [],
    } as {
      dates: number[];
      balances: number[];
    }
  );

  const series = [
    {
      name: "balance",
      data: balances,
    },
  ];

  const options_: ApexOptions = {
    ...APEX_DEFAULT_OPTIONS,
    chart: {
      id: "balance-chart",
      type: "line",
      locales: APEX_LOCALES,
      defaultLocale: "pt-br",
    },
    markers: {
      size: 4,
      colors: PRIMARY_COLORS,
    },
    xaxis: {
      tickAmount: 12,
      categories: dates,
      labels: {
        formatter: (value) => {
          return formatAnyDate(value, "dd/MM");
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return valueToCurrency(value);
        },
      },
    },
    title: {
      text: "Balance Chart",
    },
  };

  return {
    series: series,
    options: options_,
  };
};
