import { ApexOptions } from "apexcharts";
import { PRIMARY_COLORS } from "@/static/appConfig";
import { APEX_LOCALES } from "@/static/apexConfig";
import {
  Transaction,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { BankCategory } from "@/server/models/BankAccount/schema";
import { makeChartTooltip } from "@/utils/makeChartTooltip";
import { valueToCurrency } from "@/utils/misc";

export interface IMakeCategoriesChartData {
  transactions: Transaction[];
  title: string;
  type?: TransactionType;
  categories: Map<string, BankCategory>;
}

export const makeCategoriesChart = ({
  transactions,
  title,
  type = TransactionType.debit,
  categories,
}: IMakeCategoriesChartData) => {
  const seriesData = transactions.reduce<Map<string, number>>((acc, entry) => {
    if (type && type !== entry.type) {
      return acc;
    }

    entry.categories.forEach((categoryId) => {
      const prev = acc.get(categoryId) || 0;
      acc.set(categoryId, prev + entry.amount);
    });

    return acc;
  }, new Map());

  const labels: string[] = [];
  const series: number[] = [];
  const colors: string[] = [];

  Array.from(seriesData.entries()).map(([key, value]) => {
    const category = categories.get(key);
    if (category) {
      labels.push(category.name);
      series.push(Math.abs(value));
      colors.push(category.color);
    } else {
      console.log("Category Pie mismatch!");
    }
  });

  const options_: ApexOptions = {
    labels: labels,
    chart: {
      id: "category-chart-" + (type ?? ""),
      type: "pie",
      locales: APEX_LOCALES,
      defaultLocale: "pt-br",
    },
    markers: {
      size: 3,
      colors: PRIMARY_COLORS,
      strokeColors: ["var(--primary-foreground)"],
    },
    legend: {
      labels: {
        colors: "currentColor",
      },
      fontSize: "14px",
    },
    // xaxis: {
    //   tickAmount: 12,
    //   labels: {
    //     formatter: (value) => {
    //       return formatAnyDate(value, dateFormat);
    //     },
    //     style: {
    //       colors: "currentColor",
    //     },
    //   },
    // },
    // yaxis: {
    //   labels: {
    //     formatter: (value) => {
    //       return valueToCurrency(value);
    //     },
    //     style: {
    //       colors: ["currentColor"],
    //     },
    //   },
    // },
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
        return `${value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`;
      },
    },
    // colors: [APP_CONFIG.colors.debit],
    colors: colors,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const labels = w.config.labels;
        const label = labels[seriesIndex];
        const value = series[seriesIndex];
        const content = `${label}: ${valueToCurrency(value)}`;
        return makeChartTooltip({ content: content });
      },
    },
  };

  return {
    series: series,
    options: options_,
  };
};
