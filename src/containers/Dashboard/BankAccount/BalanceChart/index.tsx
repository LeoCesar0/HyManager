import Button from "@components/Button";
import useFetcher from "@hooks/useFetcher";
import { FirebaseFilterFor } from "@types-folder/index";
import { sub } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { FirebaseCollection } from "src/server/models";
import { listTransactionReportsBy } from "src/server/models/TransactionReport/read";
import { TransactionReport } from "src/server/models/TransactionReport/schema";

import { dateOptions, IFilterDate, makeBalanceChartData } from "./controller";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IBalanceChart {
  bankAccountId?: string;
}

const BalanceChart: React.FC<IBalanceChart> = (props) => {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<IFilterDate>(
    dateOptions[dateOptions.length - 1]
  );
  const bankAccountId =
    props.bankAccountId || (router.query.bankAccountId as string);

  const cacheKey = `balanceChart-last-${dateFilter.value}-${bankAccountId}`;

  /* --------------------------- transactionsFetcher -------------------------- */
  const transactionsFetcher = useCallback(() => {
    const now = new Date();
    const pastDate = sub(now, {
      [dateFilter.type]: dateFilter.value,
    });
    const filters: FirebaseFilterFor<TransactionReport>[] = [
      { field: "date", operator: ">=", value: pastDate },
    ];
    return listTransactionReportsBy({
      filters: filters,
      bankAccountId: bankAccountId,
      type: "day",
    });
  }, [bankAccountId, dateFilter.value]);

  const { data: transactionReports, loading } = useFetcher<TransactionReport[]>(
    {
      cacheKey,
      collection: FirebaseCollection.transactions,
      fetcher: transactionsFetcher,
      dependencies: [bankAccountId, dateFilter.value],
      initialData: [],
      stopAction: !bankAccountId,
    }
  );

  const { series, options } = useMemo(() => {
    return makeBalanceChartData({
      transactionReports: transactionReports,
      dateLapse: dateFilter,
    });
  }, [transactionReports, dateFilter]);

  if (!bankAccountId) return null;

  return (
    <div className="bg-surface shadow-md rounded-md p-6 mt-4 mb-4 text-on-surface">
      {!!options && series.length > 0 && (
        <>
          <div className="flex gap-4 mb-4">
            {dateOptions.map((item) => {
              const isSelected = dateFilter.label === item.label
              return (
                <Button
                  selected={isSelected}
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
