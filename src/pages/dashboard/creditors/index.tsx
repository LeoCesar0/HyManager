import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardCreditors } from "@/pageComponents/Dashboard/Creditors";
import { ReactElement } from "react";

const DashboardCreditorsPage = () => {
  return (
    <>
      <DashboardCreditors />
    </>
  );
};

DashboardCreditorsPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardCreditorsPage;
