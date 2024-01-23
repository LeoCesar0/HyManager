import { TransactionType } from "@/server/models/Transaction/schema";
import { cx } from "@/utils/misc";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export const TransactionCell = ({
  children,
  width = 250,
  label,
  transactionType,
}: {
  children: ReactNode;
  width?: number;
  label?: string;
  transactionType?: TransactionType;
}) => {
  return (
    <div
      className={cx([
        `px-2 py-1 rounded-sm line-clamp-2 flex items-start justify-start gap-2 text-sm`,
        ["text-credit", transactionType === TransactionType.credit],
        ["text-debit", transactionType === TransactionType.debit],
      ])}
      style={{
        width: `${width}px`,
      }}
    >
      {transactionType && transactionType === TransactionType.credit && (
        <ArrowUpIcon className="h-4 w-4" />
      )}
      {transactionType && transactionType === TransactionType.debit && (
        <ArrowDownIcon className="h-4 w-4" />
      )}
      {label && (
        <span className="font-semibold">
          {label}
          {": "}
        </span>
      )}
      {children}
    </div>
  );
};
