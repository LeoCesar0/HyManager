import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from 'react';
import { DashboardTransactionsAdd } from '@pageComponents/Dashboard/Transactions/add/index';

const DashboardTransactionsAddPage = () => {
  return <DashboardTransactionsAdd />;
};

export default DashboardTransactionsAddPage;

DashboardTransactionsAddPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
