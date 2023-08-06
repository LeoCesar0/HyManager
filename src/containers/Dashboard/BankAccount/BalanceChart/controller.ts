import { TransactionReport } from "src/server/models/TransactionReport/schema";
import { ApexOptions } from "apexcharts";
import {
  PRIMARY_COLORS,
} from "src/static/appConfig";

import {
  formatAnyDate,
  timestampToDate,
  valueToCurrency,
} from "src/utils/misc";
import { APEX_DEFAULT_OPTIONS, APEX_LOCALES } from "src/static/apexConfig";

export interface IFilterDate {
  label: string;
  value: number;
  type: 'days' | 'months'
}

export const dateOptions: IFilterDate[] = [
  {
    label: "Last 7 days",
    value: 7,
    type: 'days'
  },
  {
    label: "Last month",
    value: 1,
    type: 'months'
  },
  {
    label: "Last 3 months",
    value: 3,
    type: 'months'
  },
  {
    label: "Last 12 months",
    value: 12,
    type: 'months'
  },
];

export const makeBalanceChartData = ({
  transactionReports,
  dateLapse,
}: {
  transactionReports: TransactionReport[];
  dateLapse: IFilterDate;
}) => {
  const dateFormat = "dd/MM";

  const { dates, balances } = transactionReports.reduce(
    (acc, entry) => {
      const date = timestampToDate(entry.date).getTime();
      const currentBalance = entry.accountBalance

      if (acc.dates.length === 0) console.log("---- START -----");
      console.log("Date -->", timestampToDate(entry.date).toLocaleDateString());
      console.log("currentBalance -->", currentBalance);
      console.log("entry -->", entry);

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
          return formatAnyDate(value, dateFormat);
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
