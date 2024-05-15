import { ITableColumn } from "@/@types/Table";
import { Section, SectionContainer } from "@/components/Section/Section";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import { useRouter } from "next/router";
import { getColumns } from "./getColumns";
import { useEffect, useState } from "react";
import { ALGOLIA_CLIENT, ALGOLIA_INDEXES } from "@/services/algolia";
import { PaginationResult } from "@/@types";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import selectT from "@/utils/selectT";
import useT from "@/hooks/useT";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/TableSkeleton";

export const DashboardCreditors = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const [paginationResult, setPaginationResult] =
    useState<PaginationResult<BankCreditor> | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const page = router.query.page ? Number(router.query.page) : 1;
  const limit = router.query.limit ? Number(router.query.limit) : 10;

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const algoliaIndex = ALGOLIA_CLIENT.initIndex(ALGOLIA_INDEXES.CREDITORS);
      algoliaIndex.setSettings({
        searchableAttributes: ["creditor"],
        hitsPerPage: limit,
      });
      algoliaIndex
        .search(search, {
          page: page - 1,
        })
        .then((res) => {
          setPaginationResult({
            count: res.nbHits,
            currentPage: res.page + 1,
            list: res.hits.map((item) => {
              const _item = item as unknown as BankCreditor;
              return {
                bankAccountId: _item.bankAccountId!,
                creditor: _item.creditor!,
                id: _item.id!,
                categoryId: _item.categoryId,
                creditorSlug: _item.creditorSlug,
              };
            }),
            pages: res.nbPages,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, page, limit]);

  const columns: ITableColumn<BankCreditor>[] = getColumns({ currentLanguage });

  const onPageSelected = (_page: number, _limit: number = limit) => {
    router.push(
      `/dashboard/creditors?page=${_page}&limit=${_limit}`,
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    onPageSelected(page, limit);
  }, [page, limit]);

  const paginationControl = paginationResult
    ? {
        onPageSelected: onPageSelected,
        paginationResult: paginationResult,
      }
    : undefined;

  const searchLabel = useT({
    en: "Search",
    pt: "Buscar",
  });
  const placeHolder = useT({
    en: "Gas Station",
    pt: "Posto de Gasolina",
  });

  return (
    <>
      <SectionContainer>
        <Section
          sectionTitle={{
            pt: "Beneficiários",
            en: "Beneficiaries",
          }}
        >
          <>
            <TableContainer
              actions={
                <>
                  <div className="max-w-xs gird grid-cols-1">
                    <Label>{searchLabel}</Label>
                    <Input
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={placeHolder}
                    />
                  </div>
                </>
              }
              pagination={paginationControl}
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
                <TableBody
                  hasNoItems={!paginationResult?.list.length && !isLoading}
                >
                  {paginationResult?.list?.map((transaction) => {
                    return (
                      <TableRow key={transaction.id}>
                        {columns.map((column) => {
                          if (column.key === "creditor") {
                            const label = transaction.creditor;
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
            </TableContainer>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
