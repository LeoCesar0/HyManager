import { Locale } from "@/@types";
import { HomeIcon } from "@radix-ui/react-icons";
import {
  MdStackedBarChart,
  MdDashboard,
  MdSettings,
  MdPieChart,
} from "react-icons/md";
import { IconType } from "react-icons/lib";

interface MenuItem {
  label: {
    [key in Locale]: string;
  };
  icon: typeof HomeIcon | IconType;
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
    icon: MdPieChart,
    link: "/dashboard/charts",
  },
  {
    label: {
      pt: "Transações",
      en: "Transactions",
    },
    icon: MdStackedBarChart,
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
