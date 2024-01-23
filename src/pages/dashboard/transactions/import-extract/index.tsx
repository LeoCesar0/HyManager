import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardTransactionsImportExtract } from "@/pageComponents/Dashboard/Transactions/importExtract";
import { ReactElement } from "react";

const DashboardTransactionsImportExtractPage = () => {
  return <DashboardTransactionsImportExtract />;
};

DashboardTransactionsImportExtractPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardTransactionsImportExtractPage;
