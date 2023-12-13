import { Section } from "@/components/Section/Section";
import useT from "@/hooks/useT";
import { SectionContainer } from "../../../components/Section/Section";
import { Transaction } from "@/server/models/Transaction/schema";
import useSwr from "swr";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { listTransactionsByBankId } from "../../../server/models/Transaction/read/listTransactionsByBankId";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ITableColumn } from "@/@types/Table";
import { Timestamp } from "firebase/firestore";
import { formatTimestamp } from "@/utils/date/formatTimestamp";
import { valueToCurrency } from "../../../utils/misc";

interface IProps {}

export const DashboardTransactions: React.FC<IProps> = ({}) => {
  const { currentBankAccount } = useGlobalDashboardStore();

  const router = useRouter();

  const page = router.query.page ? Number(router.query.page) : 1;
  const limit = router.query.limit ? Number(router.query.limit) : 10;

  const { data: pagination } = useSwr(
    currentBankAccount ? ["transactions-table", currentBankAccount.id] : null,
    ([_, id]) => {
      return listTransactionsByBankId({
        id: id,
        pagination: {
          limit: limit,
          page: page,
        },
      });
    }
  );

  const columns: ITableColumn<Transaction>[] = [
    {
      key: "creditor",
      label: useT({
        en: "Creditor",
        pt: "Credor",
      }),
    },
    {
      key: "amount",
      label: useT({
        en: "Amount",
        pt: "Valor",
      }),
    },
    {
      key: "createdAt",
      label: useT({
        en: "Created at",
        pt: "Criado em",
      }),
    },
    {
      key: "updatedAt",
      label: useT({
        en: "Updated at",
        pt: "Atualizado em",
      }),
    },
  ];

  const total: number =
    pagination?.data?.list.reduce((acc, entry) => {
      return acc + entry.amount;
    }, 0) || 0;

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
                  <>
                    {useT({
                      en: "Add new",
                      pt: "Adicionar",
                    })}
                  </>
                </Button>
              </Link>
            </>
          }
        >
          <>
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((columns) => {
                      return (
                        <TableHead key={columns.key}>{columns.label}</TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination?.data?.list?.map((transaction) => {
                    return (
                      <TableRow key={transaction.id}>
                        {columns.map((column) => {
                          if (transaction[column.key] instanceof Timestamp) {
                            const value = transaction[column.key] as Timestamp;
                            const label = formatTimestamp(value);
                            return (
                              <TableCell key={column.key}>{label}</TableCell>
                            );
                          }

                          if (column.key === "amount") {
                            const value = transaction.amount;
                            const label = valueToCurrency(value);
                            return (
                              <TableCell key={column.key}>{label}</TableCell>
                            );
                          }

                          return (
                            <TableCell key={column.key}>
                              {transaction[column.key] as string}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TableFooter>
                <strong>Total:</strong> {valueToCurrency(total)}
              </TableFooter>
            </TableContainer>
          </>
        </Section>

        {/* <Section>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Creditor</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>id</td>
                  <td>500</td>
                  <td>Fulano</td>
                  <td>today</td>
                  <td>today</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section> */}
      </SectionContainer>
    </>
  );
};
