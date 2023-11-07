import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from "react";
import { DashboardTransactionsAdd } from "@pageComponents/Dashboard/Transactions/add/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["zod"])),
    },
  };
};

const DashboardTransactionsAddPage = () => {
  return <DashboardTransactionsAdd />;
};

export default DashboardTransactionsAddPage;

DashboardTransactionsAddPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
