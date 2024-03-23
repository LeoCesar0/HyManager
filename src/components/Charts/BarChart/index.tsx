import { ChartSerie } from "@/@types/Chart";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const defaultOptions: ApexOptions = {
  chart: {
    type: "bar",
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
};

export type BarChartProps = {
  options?: ApexOptions;
  series: ChartSerie[];
};

export const BarChart = ({ series, options = defaultOptions }: BarChartProps) => {
  return (
    <>
      <div>
        <Chart options={options} series={series} type="bar" width="100%" height={400} />
      </div>
    </>
  );
};
