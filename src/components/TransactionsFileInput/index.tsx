import { useGlobalAuth } from "@contexts/GlobalAuth";
import { useGlobalCache } from "@contexts/GlobalCache";
import { FirebaseCollection } from "@server/firebase";
import { CSVData } from "@types-folder/index";
import { handleToastPromise } from "@utils/app";
import { InputHTMLAttributes, useRef } from "react";

import { onFileInputChange } from "./onFileInputChange";

interface ITransactionsFileInput extends InputHTMLAttributes<HTMLInputElement> {
  currentBankId: string;
}

const TransactionsFileInput: React.FC<ITransactionsFileInput> = ({
  currentBankId,
  ...rest
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchCollection } = useGlobalCache();
  const { currentUser } = useGlobalAuth();

  function handleButtonClick() {
    fileInputRef.current!.click();
  }

  return (
    <div className="">
      <input
        multiple
        accept=".csv,.pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={(event) => {
          handleToastPromise(
            onFileInputChange({
              bankAccountId: currentBankId,
              event,
              fileInputRef,
              userId: currentUser!.id,
            }),
            {
              loadingMessage: "Loading file",
            }
          ).then((result) => {
            if (result.done) {
              refetchCollection([
                FirebaseCollection.transactions,
                FirebaseCollection.transactionReports,
              ]);
            }
          });
        }}
        {...rest}
        type="file"
      />
      <button
        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
        onClick={handleButtonClick}
      >
        Select CSV files
      </button>
    </div>
  );
};

export default TransactionsFileInput;
