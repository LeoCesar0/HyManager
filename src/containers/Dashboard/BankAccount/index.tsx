import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGlobalAuth } from "@contexts/GlobalAuth";
import { BankAccount } from "@types-folder/models/BankAccount";

const BankAccount = ({}) => {
  const [currentBank, setCurrentBank] = useState<BankAccount>();
  const { currentUser, userBankAccounts } = useGlobalAuth();
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
    <div className="page-container">
      <h1 className="text-xl border-b-primary border-b-2 py-2">{currentBank?.title}</h1>
    </div>
  );
};

export default BankAccount;
