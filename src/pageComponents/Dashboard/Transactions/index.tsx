import { Section } from "@/components/Section/Section";
import { SectionContainer } from "../../../components/Section/Section";
import { Transaction } from "@/server/models/Transaction/schema";
import { useGlobalDashboardStore } from "../../../contexts/GlobalDashboardStore";
import { paginateTransactionsByBankId } from "../../../server/models/Transaction/read/paginateTransactionsByBankId";
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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { FirebaseFilterFor, PaginationResult } from "@/@types";
import { MultipleSelect } from "@/components/MultipleSelect/MultipleSelect";
import { CategorySelect } from "../components/CategorySelect";

interface IProps {}

export const DashboardTransactions: React.FC<IProps> = ({}) => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [pagination, setPagination] =
    useState<PaginationResult<Transaction> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const router = useRouter();

  const page = router.query.page ? Number(router.query.page) : 1;
  const limit = router.query.limit ? Number(router.query.limit) : 10;

  useEffect(() => {
    const timeout = 500;
    const timer = setTimeout(() => {
      const filters: FirebaseFilterFor<Transaction>[] = [];
      if (typeof minValue === "number") {
        filters.push({
          field: "absAmount",
          operator: ">=",
          value: minValue,
        });
      }
      if (typeof maxValue === "number") {
        filters.push({
          field: "absAmount",
          operator: "<=",
          value: maxValue,
        });
      }
      if (categoryFilter.length > 0) {
        filters.push({
          field: "categories",
          operator: "array-contains-any",
          value: categoryFilter,
        });
      }
      if (currentBankAccount && !isLoading) {
        setIsLoading(true);
        paginateTransactionsByBankId({
          id: currentBankAccount?.id,
          pagination: {
            limit: limit,
            page: page,
            orderBy: {
              direction: "desc",
              field: "date",
            },
          },
          filters: filters,
        })
          .then((data) => {
            setPagination(data.data);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [
    currentBankAccount?.id,
    page,
    limit,
    minValue,
    maxValue,
    categoryFilter.join(),
  ]);

  const columns: ITableColumn<Transaction>[] = getColumns({ currentLanguage });

  const total: number =
    pagination?.list.reduce((acc, entry) => {
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

  const paginationControl = pagination
    ? {
        onPageSelected: onPageSelected,
        paginationResult: pagination,
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
            <TableContainer
              pagination={paginationControl}
              actions={
                <>
                  <div className="w-[200px]">
                    <Label>
                      {selectT(currentLanguage, {
                        en: "Min Value",
                        pt: "Valor mínimo",
                      })}
                    </Label>
                    <CurrencyInput
                      name="min-value"
                      value={minValue}
                      onValueChange={setMinValue}
                      currency="BRL"
                    />
                  </div>
                  <div className="w-[200px]">
                    <Label>
                      {selectT(currentLanguage, {
                        en: "Max Value",
                        pt: "Valor máximo",
                      })}
                    </Label>
                    <CurrencyInput
                      name="max-value"
                      value={maxValue}
                      onValueChange={setMaxValue}
                      currency="BRL"
                    />
                  </div>
                  <CategorySelect
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    width={200}
                    allEnabled
                  />
                  {/* <div className="w-[200px]" >
                  <MultipleSelect
        label={selectT(currentLanguage, {
          en: 'Category',
          pt: 'Categoria',
        })}
        options={categoriesOptions}
        value={value}
        onChange={onChange}
        disabled={disabled}
        CustomLabel={({ option }) => {
          return (
            <>
              <CategoryLabel categoryId={option.value} label={option.label} />
            </>
          );
        }}
      />
    </>
                  </div> */}
                </>
              }
            >
              <Table isLoading={isLoading}>
                <TableHeader>
                  <TableRow>
                    {columns.map((columns) => {
                      return (
                        <TableHead key={columns.key}>{columns.label}</TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody hasNoItems={!pagination?.list.length}>
                  {pagination?.list?.map((transaction) => {
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

                          if (column.key === "creditor") {
                            const label = transaction.creditor
                              ? transaction.creditor
                              : transaction.description;
                            return (
                              <TableCell key={column.key}>{label}</TableCell>
                            );
                          }

                          if (column.key === "amount") {
                            const value = transaction.amount;
                            const label = valueToCurrency(Math.abs(value));
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
