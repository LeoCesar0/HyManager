import { PaginationResult } from "@/@types";
import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {isMobile} from 'react-device-detect';

export type PaginationControllerProps = {
  paginationResult: PaginationResult<any>;
  onPageSelected: (page: number) => void;
  itemsPerPage?: number;
};

export const PaginationController = ({
  paginationResult,
  onPageSelected,
}: PaginationControllerProps) => {
  const offset = isMobile ? 1 : 3;
  const currentPage = paginationResult.currentPage;

  const { pages } = useMemo(() => {
    const allPages: (number | string)[] = new Array(paginationResult.pages)
      .fill(undefined)
      .map((_, index) => index + 1);
    const pages = allPages.filter((item) => {
      return item >= currentPage - offset && item <= currentPage + offset;
    });
    if (allPages[currentPage - 1 - offset]) pages.unshift("...");
    if (allPages[currentPage - 1 + offset]) pages.push("...");
    if (pages[0] !== 1) pages.unshift(1);
    if (pages[pages.length - 1] !== paginationResult.pages)
      pages.push(paginationResult.pages);

    return {
      pages,
    };
  }, [paginationResult.pages, currentPage]);

  return (
    <>
      <Pagination className="w-full" >
        <PaginationContent
          className="flex flex-wrap mx-auto my-0"
        >
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageSelected(currentPage - 1)}
              />
            </PaginationItem>
          )}
          {pages.map((page, index) => {
            if (typeof page === "string") {
              return (
                <PaginationItem key={`ellipsis-index-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  onClick={() => onPageSelected(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {currentPage < paginationResult.pages && (
            <PaginationItem>
              <PaginationNext onClick={() => onPageSelected(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
};
