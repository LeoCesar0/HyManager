import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { APP_PAGES } from "./appPages";

export const TAILWIND_CONFIG = resolveConfig(tailwindConfig);

export const COLORS = TAILWIND_CONFIG.theme?.colors!;

// @ts-ignore
export const PRIMARY_COLORS = [COLORS!['primary']['DEFAULT'], COLORS!['secondary']['DEFAULT']] as string[];

export const APP_CONFIG = {
  appName: "HyManager",
  appPages: APP_PAGES,
  colors: {
    primary: PRIMARY_COLORS[0],
    secondary: PRIMARY_COLORS[1],
    debit: COLORS['debit'],
    credit: COLORS['credit'],
  }
} as const


