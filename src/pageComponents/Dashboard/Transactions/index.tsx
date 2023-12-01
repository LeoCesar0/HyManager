import { Section } from "@/components/Section/Section";
import useT from "@/hooks/useT";
import { SectionContainer } from "../../../components/Section/Section";
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/server/models/Transaction/schema";
import useSwr from "swr";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { listTransactionsByBankId } from "../../../server/models/Transaction/read/listTransactionsByBankId";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface IProps {}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "creditor",
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
              <Link href="/dashboard/transactions/add">
                <Button>
                  {useT({
                    en: "Add new",
                    pt: "Adicionar",
                  })}
                </Button>
              </Link>
            </>
          }
        >
          <>
            <Table className="min-h-[50vh] ">
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="h-[40px]" key={"name"}>
                  <TableCell className="font-medium">{"name"}</TableCell>
                  <TableCell>{"status"}</TableCell>
                  <TableCell>{"method"}</TableCell>
                  <TableCell className="text-right">{"amount"}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
