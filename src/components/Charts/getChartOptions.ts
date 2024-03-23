import { ApexOptions } from "apexcharts";


const defaultOptions: ApexOptions = {
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


export const getChartOptions = ({}) => {

    return {
        ....defaultOptions
    }
}