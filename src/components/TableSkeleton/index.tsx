import { Skeleton } from "../ui/skeleton";

interface TableSkeletonProps {
  nItems?: number;
}

export const TableSkeleton = ({ nItems = 10 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: nItems }).map((_, index) => {
        return (
          <>
            <Skeleton key={index} className="h-[38px] w-full my-2" />
          </>
        );
      })}
    </>
  );
};
