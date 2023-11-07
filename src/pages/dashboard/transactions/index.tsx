import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardTransactions } from "@/pageComponents/Dashboard/Transactions";
import { ReactElement } from 'react';

const DashboardTransactionsPage = () => {
  return <DashboardTransactions />;
};

export default DashboardTransactionsPage;

DashboardTransactionsPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
