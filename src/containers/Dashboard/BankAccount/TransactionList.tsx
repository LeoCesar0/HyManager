import {
  TransactionType,
  useGetTransactionsByBankQuery,
} from "@graphql-folder/generated";
import BalanceCarbonChart from "./BalanceCarbonChart";
import BalanceChart from "./BalanceChart";
import TransactionsChart from "./TransactionsChart";

interface ITransactionList {
  bankAccountId: string;
}

export const TransactionList: React.FC<ITransactionList> = ({
  bankAccountId,
}) => {
  const { data } = useGetTransactionsByBankQuery({
    variables: {
      id: bankAccountId,
    },
  });

  const transactions = data?.transactions || [];

  return (
    <div className="">
      {transactions.map((item) => {
        return <div key={item.id}>Transação de: {item.amount/100} | Tipo: {item.type} | Data: {new Date(item.date).toLocaleDateString()}</div>;
      })}

      <div>
        <BalanceChart transactions={transactions} />
      </div>
      <div className="flex items-center gap-4">
        <TransactionsChart
          transactions={transactions}
          type={TransactionType.Credit}
        />
        <TransactionsChart
          transactions={transactions}
          type={TransactionType.Debit}
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
