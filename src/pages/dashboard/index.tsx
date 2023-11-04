import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardOverView } from "@/pageComponents/Dashboard/Overview";
import { ReactElement } from "react";

const DashboardPage = () => {
  return (
    <>
      <DashboardOverView />
    </>
  );
};

export default DashboardPage;

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
