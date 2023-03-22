import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGlobalAuth } from "@contexts/GlobalAuth";
import { BankAccount } from "@types-folder/models/BankAccount";
import BankHeader from "./BankHeader";
import TransactionList from "./TransactionList";
import CSVReader, { IFileInfo } from "react-csv-reader";
import { importTransactionsFromDoc } from "src/models/Transaction/utils";
import {createManyTransactions} from "src/models/Transaction/mutateMany";

const BankAccountPage = ({}) => {
  const [currentBank, setCurrentBank] = useState<BankAccount | null>(null);
  const { userBankAccounts } = useGlobalAuth();
  const router = useRouter();
  const { id: bankAccountId } = router.query;

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

  const onFileLoaded = async (
    data: Array<any>,
    fileInfo: IFileInfo,
    originalFile: File | undefined
  ) => {
    if (currentBank?.id) {
      const results = importTransactionsFromDoc({
        data: data,
        bankAccountId: currentBank.id,
      });
      const inputs = results.data;
      if (inputs) {
        createManyTransactions({
          transactionsValues: inputs,
        });
        // const { data, done, errors, missingItems } =
        //   await createManyTransactions(results.data);
        // console.group("createManyTransactions");
        // console.log("data -->", data);
        // console.log("done -->", done);
        // console.log("errors -->", errors);
        // console.log("missingItems -->", missingItems);
        // console.groupEnd();
      }
    }
  };

  return (
    <div className="component__page-container">
      {currentBank && (
        <>
          <BankHeader currentBank={currentBank} />
          <div>
            <CSVReader onFileLoaded={onFileLoaded} />
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
