import { Locale } from "@/types";
import { HomeIcon } from "@radix-ui/react-icons";
import { GrTransaction } from "react-icons/gr";
import { ReactElement } from "react";

interface MenuItem {
  label: {
    [key in Locale]: string;
  };
  icon: typeof HomeIcon | typeof GrTransaction;
  link: string;
}

const menuItems: MenuItem[] = [
  {
    label: {
      pt: "Home",
      en: "Home",
    },
    icon: HomeIcon,
    link: "/dashboard",
  },
  {
    label: {
      pt: "Transações",
      en: "Transactions",
    },
    icon: GrTransaction,
    link: "/dashboard/transactions",
  },
];

export const DASHBOARD_CONFIG = {
  menuItems,
};
