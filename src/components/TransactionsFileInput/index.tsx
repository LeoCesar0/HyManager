import { useGlobalCache } from "@contexts/GlobalCache";
import { createManyTransactions } from "@models/Transaction/create/createManyTransactions";
import { FirebaseCollection } from "@server/firebase";
import { extractTransactionsFromCSVData } from "@server/utils/extractTransactionsFromCSVData";
import { CSVData } from "@types-folder/index";
import { ChangeEvent, InputHTMLAttributes, useRef } from "react";
import { IPDFData } from "src/lib/PDFReader/interfaces";
import { CreateTransaction } from "src/server/models/Transaction/schema";
import { handleToastPromise, showErrorToast } from "src/utils/app";

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

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const transactionsFiles: TransactionFile[] = [];
    const fileReadPromises: Promise<void>[] = [];
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) formData.append("files", file);
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

    // const allCSVData = transactionsFiles.map((item) => item.data);

    console.log("files -->", files);
    console.log("formData -->", formData);

    formData.append("bankAccountId", currentBankId);

    const res = await fetch("/api/pdf2json", {
      method: "POST",
      body: formData,
    });
    const result: IPDFData[] = await res.json();

    const jsonString = JSON.stringify(result, null, 2);
    const jsonPre = `<pre>${jsonString}</pre>`;
    const blob = new Blob([jsonPre], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    

    // window.open("data:text/json," + encodeURIComponent(result), "_blank");

    // formRef.current?.reset();

    fileInputRef.current!.value = "";

    // setSelectedFiles(transactionsFiles);
    // onFilesCSVDataReady(allCSVData)
  }

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
