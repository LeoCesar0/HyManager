import { ReactNode } from "react";

export type ChartContainerProps = {
  children: ReactNode;
};
//TODO
export const ChartContainer = ({ children }: ChartContainerProps) => {
  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <>
          <div className="flex gap-4 mb-4">
            {dateOptions.map((item) => {
              const isSelected = dateFilter.label === item.label;
              return (
                <Button
                  key={item.value}
                  onClick={() => {
                    setDateFilter(item);
                  }}
                  disabled={loading}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
          {children}
        </>
      )}
    </div>
  );
};
