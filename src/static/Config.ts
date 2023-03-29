import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.cjs";
import { ApexOptions } from "apexcharts";


export const APP_CONFIG = {
  appName: "HyManager",
};

export const TAILWIND_CONFIG = resolveConfig(tailwindConfig);
export const COLORS = TAILWIND_CONFIG.theme?.colors;
export const PRIMARY_COLORS = [COLORS!.primary, COLORS!.secondary] as string[];

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
