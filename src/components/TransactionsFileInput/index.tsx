import { useGlobalCache } from "@contexts/GlobalCache";
import { ChangeEvent, InputHTMLAttributes, useRef, useState } from "react";
import { readPDFFiles } from "./readPDFFiles";
import useT from "@/hooks/useT";
import { useToastPromise } from "@/hooks/useToastPromise";
import { IPDFData } from "../../services/PDFReader/interfaces";
import { AppModelResponse } from "../../@types/index";
import { extractPDFData } from "./extractPDFData";
import { showErrorToast } from "@/utils/app";
import { cx } from "@/utils/misc";
import clsx from "clsx";

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
  className = "",
  ...rest
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchCollection } = useGlobalCache();
  const { handleToast, isLoading } = useToastPromise();
  const [draggingOver, setDraggingOver] = useState(false);

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

    await proceedFiles(loadedFiles);
  };

  const onDrop = async (dragEvent: DragEvent) => {
    dragEvent.preventDefault();
    console.log("ON DROP");

    if (dragEvent.dataTransfer) {
      const files = Array.from(dragEvent.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      await proceedFiles(files);
    }
  };

  const proceedFiles = async (loadedFiles: File[] | null) => {
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
        en: "Loading extract",
        pt: "Carregando extrato",
      },
      defaultErrorMessage: {
        en: "Error extracting data",
        pt: "Erro ao extrair dados",
      },
      successMessage: {
        en: "Transactions Loaded",
        pt: "Transações carregadas",
      },
    });

    onTransactionsLoaded(result);
    fileInputRef.current!.value = "";
  };

  return (
    <div className={className}>
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
        className={clsx(
          "border border-dashed rounded-xl w-full min-h-[250px] flex items-center justify-center transition-all"
        )}
        onClick={handleButtonClick}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          // @ts-expect-error
          onDrop(event);
        }}
        onDragEnter={() => {
          setDraggingOver(true);
        }}
        onDragLeave={() => {
          setDraggingOver(false);
        }}
      >
        {label}
      </button>
    </div>
  );
};

export default TransactionsFileInput;
