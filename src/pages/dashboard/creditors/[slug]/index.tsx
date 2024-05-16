import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardCreditorPage } from "@/pageComponents/Dashboard/Creditors/DashboardCreditorPage";
import { ReactElement } from "react";

const Page = () => {
  return <DashboardCreditorPage />;
};

Page.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
