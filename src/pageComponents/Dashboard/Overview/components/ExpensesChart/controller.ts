import { ApexOptions } from "apexcharts";
import { APP_CONFIG, COLORS, PRIMARY_COLORS } from "@/static/appConfig";
import { valueToCurrency } from "@/utils/misc";
import { APEX_LOCALES } from "@/static/apexConfig";
import { formatAnyDate } from "@/utils/date/formatAnyDate";
import { ChartSerie, ChartSerieData } from "@/@types/Chart";
import { format } from "date-fns";
import { Transaction } from "@/server/models/Transaction/schema";

export interface IMakeExpensesChartData {
  transactions: Transaction[];
  title: string;
}

export const makeExpensesChartData = ({
  transactions,
  title,
}: IMakeExpensesChartData) => {
  const dateFormat = "dd/MM";
  const chartBy = "yyyy-MM-dd";

  const seriesData = transactions.reduce<ChartSerieData[]>((acc, entry) => {
    if (entry.amount >= 0) return acc;
    const date = entry.date.toDate();
    const dateKey = format(date, chartBy);
    const prev = acc.find((item) => item.x === dateKey);
    const amount = Math.abs(entry.amount);
    if (prev) {
      prev.y += amount;
    } else {
      acc.push({ x: dateKey, y: amount });
    }
    return acc;
  }, []);

  const series: ChartSerie[] = [
    {
      name: "expenses",
      data: seriesData,
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
      strokeColors: ["var(--primary-foreground)"],
    },
    xaxis: {
      tickAmount: 12,
      // categories: dates,
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
      text: title,
      style: {
        color: "currentColor",
      },
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      formatter: (value: number) => {
        return value.toLocaleString();
      },
    },
    colors: [APP_CONFIG.colors.debit],
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
