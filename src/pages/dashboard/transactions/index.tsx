import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardTransactions } from "@/pageComponents/Dashboard/Transactions";
import { ReactElement } from "react";

const DashboardTransactionsPage = () => {
  return <DashboardTransactions />;
};

DashboardTransactionsPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardTransactionsPage;
