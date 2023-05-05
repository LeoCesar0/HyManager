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
import { listTransactionReportsBy } from "src/models/TransactionReport/read";
import { TransactionReport } from "src/models/TransactionReport/schema";

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
  const bankAccountId = props.bankAccountId || (router.query.bankAccountId as string);

  const cacheKey = `balanceChart-last-${dateFilter.days}-${bankAccountId}`;

  const transactionsFetcher = useCallback(() => {
    const now = new Date();
    const lastDaysValue = dateFilter.days;
    const pastDate = sub(now, {
      days: lastDaysValue,
    });
    const filters: FirebaseFilterFor<TransactionReport>[] = [
      { field: "date", operator: ">=", value: pastDate },
    ];
    return listTransactionReportsBy({
      filters: filters,
      bankAccountId: bankAccountId,
      type: "day",
    });
  }, [bankAccountId, dateFilter.days]);

  const { data: transactionReports, loading } = useFetcher({
    cacheKey,
    collection: FirebaseCollection.transactions,
    fetcher: transactionsFetcher,
    dependencies: [bankAccountId, dateFilter.days],
    initialData: [],
    stopAction: !bankAccountId,
  });

  console.log('transactionReports -->', transactionReports)

  const { series, options } = useMemo(() => {
    return makeBalanceChartData({ transactions: transactionReports });
  }, [transactionReports, dateFilter]);

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
