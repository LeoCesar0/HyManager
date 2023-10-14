import { useState } from "react";
import { Transaction, TransactionType } from "src/server/models/Transaction/schema";
import BalanceChart from "./BalanceChart";
import TransactionsChart from "./TransactionsChart";

interface ITransactionList {
  bankAccountId: string;
}

export const TransactionList: React.FC<ITransactionList> = ({
  bankAccountId,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // useEffect(() => {
  //   if (!bankAccountId) return;
  //   const key = `CachedYearTransactions-${bankAccountId}`;
  //   const cachedTransactions = cache[key];
  //   if (cachedTransactions) {
  //     setTransactions(cachedTransactions);
  //   } else {
  //     listTransactionsByBankId({
  //       id: bankAccountId,
  //     }).then((result) => {
  //       if (result.data) {
  //         setCache(key, result.data);
  //         setTransactions(result.data);
  //       }
  //     });
  //   }
  // }, [bankAccountId]);

  return (
    <div>
      {/* {transactions.map((item) => {
        const date = timestampToDate(item.date);
        const formattedDate = date.toLocaleDateString();
        return (
          <div key={item.id}>
            Transação de: {item.amount} | Tipo: {item.type} | Data:{" "}
            {formattedDate}
          </div>
        );
      })} */}

      <div>
        <BalanceChart  />
      </div>
      <div className="flex items-center gap-4">
        <TransactionsChart
          transactions={transactions}
          type={TransactionType.credit}
        />
        <TransactionsChart
          transactions={transactions}
          type={TransactionType.debit}
        />
      </div>
      {/* <div>
        <BalanceCarbonChart 
          transactions={transactions}
        />
      </div> */}
    </div>
  );
};

export default TransactionList;
