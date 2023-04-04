import { useEffect, useState } from "react";
import { listTransactionsByBankId } from "src/models/Transaction/read";
import { Transaction, TransactionType } from "src/models/Transaction/schema";
import BalanceChart from "./BalanceChart";
import TransactionsChart from "./TransactionsChart";

interface ITransactionList {
  bankAccountId: string;
}

export const TransactionList: React.FC<ITransactionList> = ({
  bankAccountId,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    listTransactionsByBankId({ id: bankAccountId }).then((result) => {
      if (result.data) setTransactions(result.data);
    });
  }, [bankAccountId]);

  return (
    <div className="">
      {transactions.map((item) => {
        return (
          <div key={item.id}>
            Transação de: {item.amount} | Tipo: {item.type} | Data:{" "}
            {new Date(item.date.seconds).toLocaleDateString()}
          </div>
        );
      })}

      <div>
        <BalanceChart transactions={transactions} />
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
