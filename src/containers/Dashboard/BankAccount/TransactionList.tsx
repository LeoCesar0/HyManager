import { useGetTransactionsByBankQuery } from "@graphql-folder/generated";

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
        return <div key={item.id}>Transação de: {item.amount}</div>;
      })}
    </div>
  );
};

export default TransactionList;
