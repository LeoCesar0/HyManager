import { TransactionReport } from "src/server/models/TransactionReport/schema";
import { ApexOptions } from "apexcharts";
import { PRIMARY_COLORS } from "src/static/appConfig";

import {
  valueToCurrency,
} from "src/utils/misc";
import { APEX_DEFAULT_OPTIONS, APEX_LOCALES } from "src/static/apexConfig";
import { formatAnyDate } from "@/utils/date/formatAnyDate";
import { timestampToDate } from "@/utils/date/timestampToDate";

export interface IFilterDate {
  label: string;
  value: number;
  type: "days" | "months";
}

export const dateOptions: IFilterDate[] = [
  {
    label: "Last 7 days",
    value: 7,
    type: "days",
  },
  {
    label: "Last month",
    value: 1,
    type: "months",
  },
  {
    label: "Last 3 months",
    value: 3,
    type: "months",
  },
  {
    label: "Last 12 months",
    value: 12,
    type: "months",
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
      const periodFinalBalance = entry.finalBalance;

      if (acc.dates.length === 0) {
      }
      acc.balances = [...acc.balances, periodFinalBalance];
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
    chart: {
      id: "balance-chart",
      type: "line",
      locales: APEX_LOCALES,
      defaultLocale: "pt-br",
    },
    markers: {
      size: 3,
      colors: PRIMARY_COLORS,
      strokeColors: ['var(--primary-foreground)']
    },
    xaxis: {
      tickAmount: 12,
      categories: dates,
      labels: {
        formatter: (value) => {
          return formatAnyDate(value, dateFormat);
        },
        style: {
          colors: "currentColor",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return valueToCurrency(value);
        },
        style: {
          colors: ["currentColor"],
        },
      },
    },
    title: {
      text: "Balance Chart",
      style: {
        color: "currentColor",
      },
    },
    stroke: {
      colors: PRIMARY_COLORS,
      curve: 'smooth'
    },

    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="custom-chart">' +
          '<div class="tooltip">' +
          "<span>" +
          valueToCurrency(series[seriesIndex][dataPointIndex]) +
          "</span>" +
          "</div>" +
          "</div>"
        );
      },
    },
  };

  return {
    series: series,
    options: options_,
  };
};
