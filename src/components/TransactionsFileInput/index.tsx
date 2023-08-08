import { useGlobalCache } from "@contexts/GlobalCache";
import { createManyTransactions } from "@models/Transaction/create/createManyTransactions";
import { FirebaseCollection } from "@server/firebase";
import { extractTransactionsFromCSVData } from "@server/utils/extractTransactionsFromCSVData";
import { CSVData } from "@types-folder/index";
import { ChangeEvent, InputHTMLAttributes, useRef } from "react";
import { IPDFData } from "src/lib/PDFReader/interfaces";
import { CreateTransaction } from "src/server/models/Transaction/schema";
import { handleToastPromise, showErrorToast } from "src/utils/app";
import { onFileInputChange } from "./onFileInputChange";

interface ITransactionsFileInput extends InputHTMLAttributes<HTMLInputElement> {
  currentBankId: string;
}

export interface TransactionFile {
  file: File;
  data: CSVData;
}

const TransactionsFileInput: React.FC<ITransactionsFileInput> = ({
  currentBankId,
  ...rest
}) => {
  // const [selectedFiles, setSelectedFiles] = useState<TransactionFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchCollection } = useGlobalCache();

  const onFilesCSVDataReady = async (csvDataArray: CSVData[]) => {
    const transactionsForEveryFile: CreateTransaction[] = [];
    if (currentBankId) {
      for (const csvData of csvDataArray) {
        const results = extractTransactionsFromCSVData({
          data: csvData,
          bankAccountId: currentBankId,
        });
        if (results.data) {
          transactionsForEveryFile.push(...results.data);
        } else {
          showErrorToast(results.error);
          return;
        }
      }
      /* ------------------------- createManyTransactions ------------------------- */
      try {
        const results = await handleToastPromise(
          createManyTransactions({
            transactions: transactionsForEveryFile,
            bankAccountId: currentBankId,
          }),
          { loadingMessage: "Inserting Transactions" }
        );
        if (results.done) {
          refetchCollection([
            FirebaseCollection.transactions,
            FirebaseCollection.transactionReports,
          ]);
        }
        console.log("Final Results -->", results);
        return results;
      } catch (e) {
        console.log("createManyTransactions ERROR -->", e);
      }
    }
  };

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
          onFileInputChange({currentBankId,event,fileInputRef})
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
