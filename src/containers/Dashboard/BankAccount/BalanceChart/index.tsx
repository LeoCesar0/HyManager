import Button from "@components/Button";
import { useGlobalCache } from "@contexts/GlobalCache";
import useFetcher from "@hooks/useFetcher";
import { FirebaseFilterFor } from "@types-folder/index";
import { format, sub } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FirebaseCollection } from "src/models";
import { listTransactionsByBankId } from "src/models/Transaction/read";
import { Transaction } from "src/models/Transaction/schema";

import { dateOptions, IFilterDate, makeBalanceChartData } from "./controller";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IBalanceChart {
  bankAccountId?: string;
}

export const BalanceChart: React.FC<IBalanceChart> = (props) => {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<IFilterDate>(
    dateOptions[dateOptions.length - 1]
  );
  const bankAccountId = props.bankAccountId || (router.query.id as string);

  const cacheKey = `balanceChart-last-${dateFilter.days}-${bankAccountId}`;

  const transactionsFetcher = () => {
    const now = new Date();
    const lastDaysValue = dateFilter.days;
    const pastDate = sub(now, {
      days: lastDaysValue,
    });
    const filters: FirebaseFilterFor<Transaction>[] = [
      { field: "date", operator: ">=", value: pastDate },
    ];
    return listTransactionsByBankId({
      id: bankAccountId,
      filters: filters,
    });
  };

  const { data: transactions, loading } = useFetcher({
    cacheKey,
    collection: FirebaseCollection.transactions,
    fetcher: transactionsFetcher,
    dependencies: [],
    initialData: [],
    stopAction: !bankAccountId,
  });

  const { series, options } = useMemo(() => {
    return makeBalanceChartData({ transactions });
  }, [transactions, dateFilter]);

  if (!bankAccountId) return null;

  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <>
          <div className="flex gap-4 mb-4">
            {dateOptions.map((item) => {
              const isSelected = dateFilter.days === item.days;
              return (
                <Button
                  selected={isSelected}
                  key={item.days}
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
          <Chart
            options={options}
            series={series}
            type="line"
            height="350"
            width="100%"
          />
        </>
      )}
    </div>
  );
};

export default BalanceChart;
