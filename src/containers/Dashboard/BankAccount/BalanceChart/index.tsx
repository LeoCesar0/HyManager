import Button from "@components/Button";
import { useGlobalCache } from "@contexts/GlobalCache";
import { FirebaseFilterFor } from "@types-folder/index";
import { format, sub } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { listTransactionsByBankId } from "src/models/Transaction/read";
import { Transaction } from "src/models/Transaction/schema";

import { dateOptions, IFilterDate, makeBalanceChartData } from "./controller";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IBalanceChart {
  bankAccountId?: string;
}

export const BalanceChart: React.FC<IBalanceChart> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<IFilterDate>(
    dateOptions[dateOptions.length - 1]
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { cache, setCache } = useGlobalCache();
  const bankAccountId = props.bankAccountId || (router.query.id as string);

  useEffect(() => {
    if (!bankAccountId) return;
    const key = `balanceChart-last-${dateFilter.days}-${bankAccountId}`;
    const cachedTransactions = cache[key];

    console.log("cache -->", cache);
    console.log("dateFilter -->", dateFilter);
    console.log("cachedTransactions -->", cachedTransactions);

    if (cachedTransactions) {
      setTransactions(cachedTransactions);
    } else {
      const now = new Date();
      const lastDaysValue = dateFilter.days;
      const pastDate = sub(now, {
        days: lastDaysValue,
      });
      const filters: FirebaseFilterFor<Transaction>[] = [
        { field: "date", operator: ">=", value: pastDate },
      ];
      setLoading(true);
      listTransactionsByBankId({
        id: bankAccountId,
        filters: filters,
      })
        .then((result) => {
          if (result.data) {
            setCache(key, result.data);
            setTransactions(result.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [bankAccountId, dateFilter]);

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
