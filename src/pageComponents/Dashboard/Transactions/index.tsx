import { Section } from "@/components/Section/Section";
import useT from "@/hooks/useT";
import { SectionContainer } from "../../../components/Section/Section";
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/server/models/Transaction/schema";
import useSwr from "swr";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { listTransactionsByBankId } from "../../../server/models/Transaction/read/listTransactionsByBankId";
import { useRouter } from "next/router";
import Button from "@/components/Button";

interface IProps {}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

export const DashboardTransactions: React.FC<IProps> = ({}) => {
  const { currentBankAccount } = useGlobalDashboardStore();

  const router = useRouter();

  const page = router.query.page ? Number(router.query.page) : 1;
  const limit = router.query.limit ? Number(router.query.limit) : 10;

  const { data } = useSwr(
    currentBankAccount ? ["transactions-table", currentBankAccount.id] : null,
    ([_, id]) =>
      listTransactionsByBankId({
        id: id,
        pagination: {
          limit: limit,
          page: page,
        },
      })
  );

  return (
    <>
      <SectionContainer>
        <Section
          sectionTitle={{
            pt: "Transações",
            en: "Transactions",
          }}
          actions={
            <>
              <Button href="/dashboard/transactions/add">
                {useT({
                  en: "Add new",
                  pt: "Adicionar",
                })}
              </Button>
            </>
          }
        >
          <></>
        </Section>
      </SectionContainer>
    </>
  );
};
