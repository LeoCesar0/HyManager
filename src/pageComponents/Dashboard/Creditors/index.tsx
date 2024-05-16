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
import { useEffect, useMemo, useState } from "react";
import { ALGOLIA_CLIENT, ALGOLIA_INDEXES } from "@/services/algolia";
import { PaginationResult } from "@/@types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useT from "@/hooks/useT";
import { getCurrentBankCategories } from "@/utils/getCurrentBankCategories";
import { BankCategory } from "@/server/models/BankAccount/schema";
import selectT from "@/utils/selectT";
import { CategorySelect } from "../components/CategorySelect";

const ALL_CATEGORY_ID = "SELECT_ALL";

export const DashboardCreditors = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const [paginationResult, setPaginationResult] =
    useState<PaginationResult<BankCreditor> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORY_ID);

  const router = useRouter();

  const page = router.query.page ? Number(router.query.page) : 1;
  const limit = router.query.limit ? Number(router.query.limit) : 10;
  const search = router.query.search ? (router.query.search as string) : "";

  const categories = useMemo(() => {
    return getCurrentBankCategories({
      currentBankAccount,
      currentLanguage,
    });
  }, [currentBankAccount, currentLanguage]);

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
          filters:
            !categoryId || categoryId === ALL_CATEGORY_ID
              ? undefined
              : `categoryId:${categoryId}`,
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
  }, [search, page, limit, categoryId]);

  useEffect(() => {
    onPageSelected(page, limit);
  }, [page, limit]);

  const onPageSelected = (_page: number, _limit: number = limit) => {
    router.replace({
      query: {
        page: _page,
        limit: _limit,
        search: search,
      },
    });
  };

  const setSearch = (value: string) => {
    router.replace({
      query: {
        page: 1,
        limit: limit,
        search: value,
      },
    });
  };

  const onCategorySelected = (value: string) => {
    onPageSelected(1, limit);
    setCategoryId(value);
  };

  const columns: ITableColumn<BankCreditor>[] = getColumns({ currentLanguage });

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
  const searchPlaceholder = useT({
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
                  <div className="">
                    <Label>{searchLabel}</Label>
                    <Input
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={searchPlaceholder}
                    />
                  </div>
                  <CategorySelect
                    value={categoryId}
                    onChange={onCategorySelected}
                    defaultOption={{
                      id: ALL_CATEGORY_ID,
                      slug: ALL_CATEGORY_ID,
                      color: "#fff",
                      isDefault: true,
                      name: selectT(currentLanguage, {
                        en: "All",
                        pt: "Todas",
                      }),
                    }}
                  />
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
                  {paginationResult?.list?.map((creditor) => {
                    return (
                      <TableRow
                        key={creditor.id}
                        onClick={() => {
                          router.push(
                            `/dashboard/creditors/${creditor.creditorSlug}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                        className="cursor-pointer"
                      >
                        {columns.map((column) => {
                          if (column.key === "creditor") {
                            const label = creditor.creditor;
                            return (
                              <TableCell key={column.key}>{label}</TableCell>
                            );
                          }
                          if (column.key === "categoryId") {
                            const label =
                              categories.get(creditor.categoryId)?.name || "";
                            const color =
                              categories.get(creditor.categoryId)?.color ||
                              "#000";
                            return (
                              <TableCell
                                key={column.key}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor: color,
                                  }}
                                ></div>
                                <span>{label}</span>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={column.key}>
                              {creditor[column.key] as string}
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
