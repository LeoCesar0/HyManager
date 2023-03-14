import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGlobalAuth } from "@contexts/GlobalAuth";
import { BankAccount } from "@types-folder/models/BankAccount";
import BankHeader from "./BankHeader";
import { useGetTransactionsByBankQuery } from "@graphql-folder/generated";
import TransactionList from "./TransactionList";
import BalanceChart from "./BalanceChart";

const BankAccountPage = ({}) => {
  const [currentBank, setCurrentBank] = useState<BankAccount | null>(null);
  const { userBankAccounts } = useGlobalAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const foundBank = userBankAccounts.find((bank) => bank.id === id);
    if (foundBank) {
      setCurrentBank(foundBank);
    } else {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="global_page-container">
      <BankHeader currentBank={currentBank} />
      <div>{!!id && <TransactionList bankAccountId={id as string} />}</div>
    </div>
  );
};

export default BankAccountPage;
