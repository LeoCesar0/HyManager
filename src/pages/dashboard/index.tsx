import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@pageComponents/Dashboard";
import { ReactElement } from "react";

const DashboardPage = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
