import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGlobalAuth } from "@contexts/GlobalAuth";
import BankHeader from "./BankHeader";
import TransactionList from "./TransactionList";
import TransactionsFileInput from "@components/TransactionsFileInput";
import { BankAccount } from "src/models/BankAccount/schema";

const BankAccountPage = ({}) => {
  const [currentBank, setCurrentBank] = useState<BankAccount | null>(null);
  const { userBankAccounts } = useGlobalAuth();
  const router = useRouter();
  const { bankAccountId } = router.query;

  useEffect(() => {
    if (userBankAccounts && bankAccountId) {
      const foundBank = userBankAccounts.find(
        (bank) => bank.id === bankAccountId
      );
      if (foundBank && foundBank.id !== currentBank?.id) {
        setCurrentBank(foundBank);
      } else {
        router.push("/dashboard");
      }
    }
  }, [userBankAccounts, bankAccountId]);

  return (
    <div className="component__page-container">
      {currentBank && (
        <>
          <BankHeader currentBank={currentBank} />
          <div>
            <TransactionsFileInput currentBankId={currentBank.id} />
          </div>
          <div>
            {!!bankAccountId && (
              <TransactionList bankAccountId={bankAccountId as string} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BankAccountPage;
