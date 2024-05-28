import { ApexOptions } from "apexcharts";
import { PRIMARY_COLORS } from "@/static/appConfig";
import { APEX_LOCALES } from "@/static/apexConfig";
import {
  Transaction,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { BankCategory } from "@/server/models/BankAccount/schema";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY,
} from "@/server/models/BankAccount/static";
import { makeChartTooltip } from "@/utils/makeChartTooltip";

export interface IMakeCategoriesChartData {
  transactions: Transaction[];
  title: string;
  type?: TransactionType;
  categories: Map<string, BankCategory>;
  creditors: BankCreditor[];
}

export const makeCategoriesChart = ({
  transactions,
  title,
  type = TransactionType.debit,
  categories,
  creditors,
}: IMakeCategoriesChartData) => {
  const dateFormat = "dd/MM";

  const creditorsMap: Map<string, BankCreditor> = new Map();

  const seriesData = transactions.reduce<Map<string, number>>((acc, entry) => {
    if (entry.creditorSlug?.includes("icaro")) {
      console.log("Found icaro");
      console.log("icaro categories", entry.categories);
    }

    if (type && type !== entry.type) {
      return acc;
    }

    entry.categories.forEach((categoryId) => {
      const prev = acc.get(categoryId) || 0;
      acc.set(categoryId, prev + entry.amount);
    });

    return acc;
  }, new Map());

  console.log("categories", categories);
  console.log("seriesData", seriesData);

  // const seriesData = transactions.reduce<Map<string, number>>((acc, entry) => {
  //   if (type && type !== entry.type) {
  //     return acc;
  //   }
  //   // TODO
  //   const creditorSlug = entry?.creditorSlug;

  //   if (!creditorSlug) {
  //     const category = DEFAULT_CATEGORY["investment-default"];
  //     const prev = acc.get(category.id) || 0;
  //     acc.set(category.id, prev + entry.amount);
  //     console.log("investment");
  //     console.log("entry", entry);
  //     console.log("-----------------");
  //     return acc;
  //   }

  //   const creditor =
  //     creditorsMap.get(creditorSlug) ||
  //     creditors.find((item) => item.creditorSlug === creditorSlug);

  //   if (!creditor) {
  //     return acc;
  //   }

  //   if (!creditorsMap.has(creditorSlug))
  //     creditorsMap.set(creditorSlug, creditor);

  //   const category = categories.get(creditor.categoryId);

  //   if (!category) {
  //     console.error("Category not found");
  //     console.log("creditor", creditor);
  //     console.log("---------------");
  //     return acc;
  //   }

  //   const prev = acc.get(category.id) || 0;
  //   acc.set(category.id, prev + entry.amount);

  //   return acc;
  // }, new Map());

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

  console.log("labels", labels);
  console.log("series", series);

  // const seriesData = transactions.reduce<{
  //   series: number[];
  //   labels: string[];
  // }>((acc, entry) => {

  //   return acc
  // }, {
  //   series: [],
  //   labels: [],
  // });

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
        return makeChartTooltip({ content: labels[seriesIndex] });
      },
    },
  };

  return {
    series: series,
    options: options_,
  };
};
