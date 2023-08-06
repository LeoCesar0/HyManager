import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.cjs";

import { APP_PAGES } from "./appPages";

export const TAILWIND_CONFIG = resolveConfig(tailwindConfig);

export const COLORS = TAILWIND_CONFIG.theme?.colors;
export const PRIMARY_COLORS = [COLORS!.primary, COLORS!.secondary] as string[];

export const APP_CONFIG = {
  appName: "HyManager",
  appPages: APP_PAGES,
  colors: COLORS
};


