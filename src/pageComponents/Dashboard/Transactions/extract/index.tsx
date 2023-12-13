import { Section, SectionContainer } from "@/components/Section/Section";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { Button } from "@/components/ui/button";
import { useToastPromise } from "@/hooks/useToastPromise";
import TransactionsFileInput from "@/components/TransactionsFileInput";
import { useGlobalAuth } from "../../../../contexts/GlobalAuth";
import { PDF2JSONResponse } from "@/pages/api/pdf2json";
import { useState } from "react";
import useT from "@/hooks/useT";
import { UploadIcon } from "@radix-ui/react-icons";
import { createTransactionsFromPDFResult } from "../../../../server/utils/createTransactionsFromPDFResult";
import { uploadFilesToStorage } from "@/components/TransactionsFileInput/uploadFilesToStorage";

export const DashboardTransactionsExtract = () => {
  const [PDFResult, setPDFResult] = useState<PDF2JSONResponse | null>(null);
  const [loadedFiles, setLoadedFiles] = useState<File[]>([]);
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentUser } = useGlobalAuth();

  const { handleToast, isLoading } = useToastPromise();

  const submitTransactions = async () => {
    if (!PDFResult?.data) return;

    const uploadedFiles = await uploadFilesToStorage({
      bankAccountId: currentBankAccount!.id,
      files: loadedFiles,
      userId: currentUser!.id,
    });

    if (uploadedFiles.length === 0) {
      return {
        error: { message: "Error uploading files to storage" },
        data: null,
        done: false,
      };
    }

    const result = await createTransactionsFromPDFResult({
      bankAccountId: currentBankAccount!.id,
      pdfReadResult: PDFResult.data,
      uploadedFiles: uploadedFiles,
    });
  };

  return (
    <>
      <SectionContainer>
        <Section
          sectionTitle={{
            pt: "Importar Extrato",
            en: "Import Bank Extract",
          }}
          goBackLink="/dashboard/transactions"
          actions={
            <>
              <Button
                disabled={!PDFResult?.data || loadedFiles.length === 0}
                onClick={() => submitTransactions()}
              >
                <UploadIcon />
                {useT({
                  en: "Upload Transactions",
                  pt: "Enviar Transações",
                })}
              </Button>
            </>
          }
        >
          <>
            <TransactionsFileInput
              userId={currentUser!.id}
              currentBankId={currentBankAccount!.id}
              onFilesLoaded={setLoadedFiles}
              onTransactionsLoaded={setPDFResult}
            />
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
