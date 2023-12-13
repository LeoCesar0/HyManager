import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from "react";
import { DashboardTransactionsExtract } from "@/pageComponents/Dashboard/Transactions/extract";

const DashboardTransactionsExtractPage = () => {
  return <DashboardTransactionsExtract />;
};

export default DashboardTransactionsExtractPage;

DashboardTransactionsExtractPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
