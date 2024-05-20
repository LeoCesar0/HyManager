import { TransactionReport } from "@/server/models/TransactionReport/schema";
import { ApexOptions } from "apexcharts";
import { APP_CONFIG, COLORS, PRIMARY_COLORS } from "@/static/appConfig";
import { valueToCurrency } from "@/utils/misc";
import { APEX_LOCALES } from "@/static/apexConfig";
import { formatAnyDate } from "@/utils/date/formatAnyDate";
import { TransactionType } from "@/server/models/Transaction/schema";
import { BankCategory } from "@/server/models/BankAccount/schema";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY,
} from "@/server/models/BankAccount/static";
import { makeChartTooltip } from "@/utils/makeChartTooltip";

export interface IMakeCategoriesChartData {
  transactionReports: TransactionReport[];
  title: string;
  type?: TransactionType;
  categories: Map<string, BankCategory>;
  creditors: BankCreditor[];
}

export const makeCategoriesChart = ({
  transactionReports,
  title,
  type = TransactionType.debit,
  categories,
  creditors,
}: IMakeCategoriesChartData) => {
  const dateFormat = "dd/MM";

  const allTransactions = transactionReports
    .map((item) => item.transactions)
    .flat();

  const creditorsMap: Map<string, BankCreditor> = new Map();

  const seriesData = allTransactions.reduce<Map<string, number>>(
    (acc, entry) => {
      if (type && type !== entry.type) {
        return acc;
      }
      // TODO
      const creditorSlug = entry?.creditorSlug;

      if (!creditorSlug) {
        const category = DEFAULT_CATEGORY["investment-default"];
        const prev = acc.get(category.id) || 0;
        acc.set(category.id, prev + entry.amount);
        console.log("investment");
        console.log("entry", entry);
        console.log("-----------------");
        return acc;
      }

      const creditor =
        creditorsMap.get(creditorSlug) ||
        creditors.find((item) => item.creditorSlug === creditorSlug);

      if (!creditor) {
        console.error("Creditor not found");
        console.log("creditorSlug", creditorSlug);
        console.log("creditors", creditors);
        console.log("creditorsMap", creditorsMap);
        console.log("--------------------------");
        return acc;
      }

      if (!creditorsMap.has(creditorSlug))
        creditorsMap.set(creditorSlug, creditor);

      const category = categories.get(creditor.categoryId);

      if (!category) {
        console.error("Category not found");
        console.log("creditor", creditor);
        console.log("---------------");
        return acc;
      }

      const prev = acc.get(category.id) || 0;
      acc.set(category.id, prev + entry.amount);

      return acc;
    },
    new Map()
  );

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

  // const seriesData = transactionReports.reduce<{
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
