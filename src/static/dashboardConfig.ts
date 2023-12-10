import { AppIcon, Locale } from "@/@types";
import {
  MdStackedBarChart,
  MdDashboard,
  MdSettings,
  MdCompareArrows
} from "react-icons/md";

interface MenuItem {
  label: {
    [key in Locale]: string;
  };
  icon: AppIcon;
  link: string;
}

const menuItems: MenuItem[] = [
  {
    label: {
      pt: "Geral",
      en: "Overview",
    },
    icon: MdDashboard,
    link: "/dashboard",
  },
  {
    label: {
      pt: "Gráficos",
      en: "Charts",
    },
    icon: MdStackedBarChart,
    link: "/dashboard/charts",
  },
  {
    label: {
      pt: "Transações",
      en: "Transactions",
    },
    icon: MdCompareArrows,
    link: "/dashboard/transactions",
  },
  {
    label: {
      pt: "Configurações",
      en: "Settings",
    },
    icon: MdSettings,
    link: "/dashboard/settings",
  },
];

export const DASHBOARD_CONFIG = {
  menuItems,
};
