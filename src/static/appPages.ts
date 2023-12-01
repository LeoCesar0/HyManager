import { AppPage } from "@/@types/AppPage";

export const APP_PAGES: AppPage[] = [
  {
    label: "Home",
    link: "/",
    private: false,
    adminOnly: false,
  },
  {
    label: "Dashboard",
    link: "/dashboard",
    private: true,
    adminOnly: false,
  },
];
