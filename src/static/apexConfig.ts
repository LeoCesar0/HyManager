import { ApexOptions } from "apexcharts";
import { PRIMARY_COLORS } from "./appConfig";
import en from "./ApexLocales/en.json";
import ptBr from "./ApexLocales/pt-br.json";

export const APEX_LOCALES = [ptBr, en];

export const APEX_DEFAULT_OPTIONS: ApexOptions = {
    colors: PRIMARY_COLORS,
    xaxis: {
      labels: {
        style: {
          colors: "#393939",
        },
      },
    },
  };