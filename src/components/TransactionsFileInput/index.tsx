import { useGlobalCache } from "@contexts/GlobalCache";
import { ChangeEvent, InputHTMLAttributes, useRef } from "react";
import { readPDFFiles } from "./readPDFFiles";
import useT from "@/hooks/useT";
import { useToastPromise } from "@/hooks/useToastPromise";
import { IPDFData } from "../../services/PDFReader/interfaces";
import { AppModelResponse } from "../../@types/index";
import { extractPDFData } from "./extractPDFData";
import { showErrorToast } from "@/utils/app";

interface ITransactionsFileInput extends InputHTMLAttributes<HTMLInputElement> {
  currentBankId: string;
  userId: string;
  onFilesLoaded: (files: File[]) => void;
  onTransactionsLoaded: (data: AppModelResponse<IPDFData[]>) => void;
}

const TransactionsFileInput: React.FC<ITransactionsFileInput> = ({
  currentBankId,
  userId,
  onTransactionsLoaded,
  onFilesLoaded,
  ...rest
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchCollection } = useGlobalCache();

  const { handleToast, isLoading } = useToastPromise();

  function handleButtonClick() {
    fileInputRef.current!.click();
  }

  const label = useT({
    en: "Load PDFs",
    pt: "Carregar arquivos PDF",
  });

  const onFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const loadedFiles = readPDFFiles({
      event,
    });

    if (!loadedFiles) {
      showErrorToast({
        message: "Error loading files!",
      });
      return;
    }

    onFilesLoaded(loadedFiles);

    const promise = extractPDFData({
      bankAccountId: currentBankId,
      files: loadedFiles,
    });

    const result = await handleToast(promise, {
      loadingMessage: {
        en: "Loading data",
        pt: "Carregando dados",
      },
      defaultErrorMessage: {
        en: "Error extracting data",
        pt: "Erro ao extrair dados",
      },
    });

    onTransactionsLoaded(result);

    // .then((result) => {
    //   if (result.done) {
    //     refetchCollection([
    //       FirebaseCollection.transactions,
    //       FirebaseCollection.transactionReports,
    //     ]);
    //   }
    // });
    fileInputRef.current!.value = "";
  };

  return (
    <div className="">
      <input
        multiple
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={(event) => onFileInputChange(event)}
        type="file"
        {...rest}
      />
      <button
        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
        onClick={handleButtonClick}
      >
        {label}
      </button>
    </div>
  );
};

export default TransactionsFileInput;
