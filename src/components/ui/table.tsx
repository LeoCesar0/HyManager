import * as React from "react";
import { cn } from "@/lib/utils";
import {
  PaginationController,
  PaginationControllerProps,
} from "../PaginationController";
import { useGlobalContext } from "@/contexts/GlobalContext";
import selectT from "@/utils/selectT";
import { TableSkeleton } from "../TableSkeleton";

const rowHeight = "45xp";

type ITableContainer = {
  pagination?: PaginationControllerProps;
  actions?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const TableContainer = React.forwardRef<HTMLDivElement, ITableContainer>(
  ({ className, children, pagination, actions, ...props }, ref) => {
    const paginationResult = pagination?.paginationResult;

    return (
      <div
        className={cn(
          "relative w-full overflow-x-auto rounded-sm bg-card text-card-foreground",
          "flex flex-col ",
          className
        )}
        ref={ref}
        {...props}
      >
        <>
          {actions && (
            <header className="p-4 flex items-center gap-4">{actions}</header>
          )}
          {children}
          {paginationResult && (
            <div className="p-2 w-full">
              <PaginationController
                paginationResult={paginationResult}
                onPageSelected={pagination.onPageSelected}
              />
            </div>
          )}
        </>
      </div>
    );
  }
);
TableContainer.displayName = "TableContainer";

type TableProps = {
  isLoading: boolean;
  nItems?: number;
};

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & TableProps
>(({ className, isLoading, nItems = 10, ...props }, ref) => (
  <div className="min-h-[492px] block p-4">
    {isLoading && <TableSkeleton nItems={nItems} />}
    {!isLoading && (
      <table
        ref={ref}
        className={cn("caption-bottom text-sm w-full", className)}
        {...props}
      />
    )}
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

type TableBodyProps = {
  hasNoItems: boolean;
};

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & TableBodyProps
>(({ className, children, hasNoItems, ...props }, ref) => {
  const { currentLanguage } = useGlobalContext();

  const hasNoItemsText = selectT(currentLanguage, {
    en: "No items found",
    pt: "Nenhum item encontrado",
  });

  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0 w-full", className)}
      {...props}
    >
      <>
        {hasNoItems && (
          <tr>
            <td className="p-4 text-lg">{hasNoItemsText}</td>
          </tr>
        )}
        {!hasNoItems && children}
      </>
    </tbody>
  );
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn(
      // "block mt-auto bg-primary font-medium text-primary-foreground p-2",
      "block font-medium text-primary-foreground px-4 py-2 border-b ",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "w-full border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "w-[100px] h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <>
    <td
      ref={ref}
      className={cn(
        "p-2 py-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] truncate",
        className
      )}
      {...props}
    >
      {children}
    </td>
  </>
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
