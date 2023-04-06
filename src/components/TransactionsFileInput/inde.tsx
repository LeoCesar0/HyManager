import { CSVData } from "@types-folder/index";
import { ChangeEvent, InputHTMLAttributes, useRef, useState } from "react";
import { createManyTransactions } from "src/models/Transaction/create";
import { CreateTransaction } from "src/models/Transaction/schema";
import { extractTransactionsFromCSVData } from "src/models/Transaction/utils";
import { handleToastPromise } from "src/utils/app";

interface ITransactionsFileInput extends InputHTMLAttributes<HTMLInputElement> {
  currentBankId: string;
}

interface TransactionFile {
  file: File;
  data: CSVData;
}

const TransactionsFileInput: React.FC<ITransactionsFileInput> = ({
  currentBankId,
  ...props
}) => {
  const [selectedFiles, setSelectedFiles] = useState<TransactionFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        }
      }
      /* ------------------------- createManyTransactions ------------------------- */
      try {
        const results = await handleToastPromise(
          createManyTransactions({
            values: transactionsForEveryFile,
            bankAccountId: currentBankId,
          }),
          { loadingMessage: "Inserting Transactions" }
        );
        console.log("Final Results -->", results);
      } catch (e) {
        console.log("createManyTransactions ERROR -->", e);
      }
    }
  };

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    console.log("handleFileInputChange -->", handleFileInputChange);
    const files = event.target.files;
    if (!files) return;
    const transactionsFiles: TransactionFile[] = [];
    const fileReadPromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      console.log("File -->");
      const file = files.item(i);
      if (file && file.type === "text/csv") {
        const fileReader = new FileReader();

        const promise = new Promise<void>((resolve) => {
          fileReader.onload = () => {
            const csvData = fileReader.result as string;
            const csvDataArrayForFile = csvData
              .split("\n")
              .map((row) => row.split(","));
            transactionsFiles.push({
              file: file,
              data: [...csvDataArrayForFile],
            });
            resolve();
          };
          fileReader.readAsText(file!);
        });

        fileReadPromises.push(promise);
      }
    }
    await Promise.all(fileReadPromises);
    const allCSVData = transactionsFiles.map((item) => item.data);
    setSelectedFiles(transactionsFiles);
    onFilesCSVDataReady(allCSVData);
  }

  function handleButtonClick() {
    fileInputRef.current!.click();
  }

  return (
    <div className="">
      <input
        multiple
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        {...props}
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
