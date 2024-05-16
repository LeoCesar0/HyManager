import { TransactionType } from "@/server/models/Transaction/schema";
import { cx } from "@/utils/misc";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export const SimpleTableCell = ({
  children,
  width = 150,
  label,
  before,
  className = "",
  transactionType,
}: {
  children: ReactNode;
  width?: number;
  label?: string;
  transactionType?: TransactionType;
  before?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cx([
        `px-2 py-1 rounded-sm line-clamp-2 flex items-start justify-start gap-2 text-sm`,
        ["text-deposit", transactionType === TransactionType.deposit],
        ["text-debit", transactionType === TransactionType.debit],
        className,
      ])}
      style={{
        width: `${width}px`,
      }}
    >
      {before && before}
      {transactionType && transactionType === TransactionType.deposit && (
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
