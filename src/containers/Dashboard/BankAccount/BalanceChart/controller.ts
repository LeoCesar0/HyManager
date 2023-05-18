import { TransactionReport } from "@models/TransactionReport/schema";
import { ApexOptions } from "apexcharts";
import currency from "currency.js";
import { add, sub,differenceInCalendarDays } from "date-fns";
import { Transaction, TransactionType } from "src/models/Transaction/schema";
import {
  APEX_DEFAULT_OPTIONS,
  APEX_LOCALES,
  PRIMARY_COLORS,
} from "src/static/Config";

import {
  formatAnyDate,
  timestampToDate,
  valueToCurrency,
} from "src/utils/misc";

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
  // const finalDate = new Date();
  // const initialDate = sub(finalDate, {
  //   [dateLapse.type]: dateLapse.value,
  // });
  // const balances: number[] = [0];
  // const dates:string[] = [formatAnyDate(initialDate, dateFormat)]

  // transactionReports.sort((a, b) => {
  //   return a.date.seconds - b.date.seconds
  // })

  // console.log('After sort -->', transactionReports)

  // // const dates = new Array(dayslapse).map((_, index) => {
  // //   const date = add(initialDate, {
  // //     days: index,
  // //   });
  // //   return formatAnyDate(date, dateFormat);
  // // });

  // const transactionsReportMap: Map<string, number> = new Map();

  // transactionReports.forEach((report) => {
  //   console.log('report.date -->', report.date)
  //   const reportDate = formatAnyDate(report.date, dateFormat);
  //   transactionsReportMap.set(reportDate, report.accountBalance);


  //   if(dates[0] === reportDate) {
  //     balances[0] = report.accountBalance
  //   }else{
  //     balances.push(report.accountBalance)
  //     dates.push(reportDate)
  //   }

  // });


  // console.log("balances -->", balances);
  // console.log("dates -->", dates);
  // console.log("transactionsReportMap -->", transactionsReportMap);


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
