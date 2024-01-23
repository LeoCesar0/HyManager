import { Section, SectionContainer } from "@/components/Section/Section";
import { Form } from "@/components/ui/form";
import { createTransactionFromPDFSchema } from "@/server/models/Transaction/schema";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { makeZodI18nMap } from "zod-i18n-map";
import { FormFields } from "@/components/FormFields";
import { formFields } from "./formFields";
import { createTransaction } from "@/server/models/Transaction/create/createTransaction";
import { useToastPromise } from "@/hooks/useToastPromise";
import { UploadIcon } from "@radix-ui/react-icons";
import useT from "@/hooks/useT";
import Link from "next/link";
import TransactionsFileInput from "@/components/TransactionsFileInput";
import { useGlobalAuth } from "@/contexts/GlobalAuth";
import React, { useState } from "react";
import { AppModelResponse } from "@/@types";
import { IPDFData } from "@/services/PDFReader/interfaces";
import { If, Then } from "react-if";
import selectT from "@/utils/selectT";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { ExtractDetail } from "./ExtractDetail";
import { PDF2JSONResponse } from "@/server/routes/readPdfFilesRoute";
import { createTransactionsFromPDFResult } from "@/server/utils/createTransactionsFromPDFResult";
import { uploadFilesToStorage } from "@/components/TransactionsFileInput/uploadFilesToStorage";

export const DashboardTransactionsImportExtract = () => {
  const [loadedFiles, setLoadedFiles] = useState<File[]>([]);
  const [extractResponse, setExtractResponse] =
    useState<PDF2JSONResponse | null>(null);
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentUser } = useGlobalAuth();
  const { currentLanguage } = useGlobalContext();

  const { handleToast, isLoading } = useToastPromise();

  async function submitTransactions() {
    if (!extractResponse?.data) return;

    const uploadedFiles = await uploadFilesToStorage({
      bankAccountId: currentBankAccount!.id,
      files: loadedFiles,
    });

    if (uploadedFiles.length === 0) {
      return {
        error: { message: "Error uploading files to storage" },
        data: null,
        done: false,
      };
    }

    // const result = await createTransactionsFromPDFResult({
    //   bankAccountId: currentBankAccount!.id,
    //   pdfReadResult: extractResponse.data,
    //   uploadedFiles: uploadedFiles,
    // });
  }

  const onTransactionsLoaded = (result: PDF2JSONResponse) => {
    setExtractResponse(result);
  };

  const onFilesLoaded = (files: File[]) => {
    setLoadedFiles(files);
  };

  const extractResult = extractResponse?.data || null;

  return (
    <>
      <SectionContainer>
        <Section
          sectionTitle={{
            pt: "Importar Extrato Bancário",
            en: "Import extract",
          }}
          goBackLink="/dashboard/transactions"
          actions={
            <>
              <Button
                disabled={!extractResponse?.data || loadedFiles.length === 0}
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
              currentBankId={currentBankAccount!.id}
              userId={currentUser!.id}
              onFilesLoaded={onFilesLoaded}
              onTransactionsLoaded={onTransactionsLoaded}
            />
            <If condition={!!extractResult}>
              <Then>
                <div>
                  {extractResult?.map((pdfData, pdfIndex) => {
                    return (
                      <React.Fragment key={"pdf-" + pdfIndex}>
                        <ExtractDetail pdfData={pdfData} pdfIndex={pdfIndex} />
                      </React.Fragment>
                    );
                  })}
                </div>
              </Then>
            </If>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
