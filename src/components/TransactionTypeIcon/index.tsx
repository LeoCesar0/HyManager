import { cn } from "@/lib/utils";
import { TransactionType } from "@/server/models/Transaction/schema";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

export const TransactionTypeIcon = ({ type }: { type: TransactionType }) => {
  return (
    <div
      className={cn({
        "text-deposit": type === TransactionType.deposit,
        "text-debit": type === TransactionType.debit,
      })}
    >
      {TransactionType.deposit ? (
        <ArrowUpIcon className="h-4 w-4" />
      ) : (
        <ArrowDownIcon className="h-4 w-4" />
      )}
    </div>
  );
};
