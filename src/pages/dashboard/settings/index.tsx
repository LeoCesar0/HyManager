import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardSettings } from "@/pageComponents/Dashboard/Settings";
import { ReactElement } from "react";

const DashboardSettingsPage = () => {
  return (
    <>
      <DashboardSettings />
    </>
  );
};

DashboardSettingsPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardSettingsPage;
