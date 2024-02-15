import { Section } from "@/components/Section/Section";
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
import { ArrowUpIcon, UploadIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { useGlobalContext } from "@/contexts/GlobalContext";
import selectT from "@/utils/selectT";
import { getColumns } from "./getColumns";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface IProps {}

export const DashboardTransactions: React.FC<IProps> = ({}) => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();

  const router = useRouter();

  const page = router.query.page ? Number(router.query.page) : 1;
  const limit = router.query.limit ? Number(router.query.limit) : 10;

  const argsKey:[string, string, number, number] = ["transactions-table", currentBankAccount?.id || '', page, limit]
  const listKey = currentBankAccount ? argsKey  : null

  const { data: pagination } = useSwr(
    listKey,
    (args) => {
      console.log('args', args)
      const [_, id, page, limit] = args as typeof argsKey
      return listTransactionsByBankId({
        id: id,
        pagination: {
          limit: limit,
          page: page,
        },
      });
    }
  );

  const columns: ITableColumn<Transaction>[] = getColumns({ currentLanguage });

  const total: number =
    pagination?.data?.list.reduce((acc, entry) => {
      return acc + entry.amount;
    }, 0) || 0;

  const onPageSelected = (_page: number, _limit: number = limit) => {
    router.push(
      `/dashboard/transactions?page=${_page}&limit=${_limit}`,
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    onPageSelected(page, limit);
  }, [page, limit]);

  const paginationControl = pagination?.data
    ? {
        onPageSelected: onPageSelected,
        paginationResult: pagination?.data,
      }
    : undefined;

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
                    {selectT(currentLanguage, {
                      en: "Add new",
                      pt: "Adicionar",
                    })}
                  </>
                </Button>
              </Link>
            </>
          }
          rightActions={
            <>
              <Link href="/dashboard/transactions/import-extract">
                <Button variant={"secondary"}>
                  <UploadIcon />
                  {selectT(currentLanguage, {
                    en: "Import from Extract",
                    pt: "Importar Extrato",
                  })}
                </Button>
              </Link>
            </>
          }
        >
          <>
            <TableContainer pagination={paginationControl}>
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
                            const isDeposit = value > 0;
                            return (
                              <TableCell key={column.key}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn({
                                      "text-deposit": isDeposit,
                                      "text-debit": !isDeposit,
                                    })}
                                  >
                                    {isDeposit ? (
                                      <ArrowUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ArrowDownIcon className="h-4 w-4" />
                                    )}
                                  </div>
                                  {label}
                                </div>
                              </TableCell>
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
                <p
                  className={cn(
                    "font-bold text-lg tracking-wide text-foreground",
                    {
                      "text-deposit": total > 0,
                      "text-debit": total < 0,
                    }
                  )}
                >
                  <span className="font-medium text-base text-foreground">
                    Total:
                  </span>{" "}
                  {valueToCurrency(total)}
                </p>
              </TableFooter>
            </TableContainer>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
