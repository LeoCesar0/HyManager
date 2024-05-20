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
  series: any[];
  height?: number;
};

export const PieChart = ({
  series,
  options = defaultOptions,
  height = 350,
}: BarChartProps) => {
  return (
    <>
      <div>
        <Chart
          options={options}
          series={series}
          type="pie"
          width={"100%"}
          height={height}
        />
      </div>
    </>
  );
};
