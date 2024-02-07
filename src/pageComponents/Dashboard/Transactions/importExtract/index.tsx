import { Section, SectionContainer } from "@/components/Section/Section";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { Button } from "@/components/ui/button";
import { useToastPromise } from "@/hooks/useToastPromise";
import { UploadIcon } from "@radix-ui/react-icons";
import useT from "@/hooks/useT";
import TransactionsFileInput from "@/components/TransactionsFileInput";
import { useGlobalAuth } from "@/contexts/GlobalAuth";
import React, { useMemo, useState } from "react";
import { Else, If, Then } from "react-if";
import { ExtractPage } from "./components/ExtractPage";
import { PDF2JSONResponse } from "@/server/routes/readPdfFilesRoute";
import { createTransactionsFromPDFResult } from "@/server/utils/createTransactionsFromPDFResult";
import { uploadFilesToStorage } from "@/components/TransactionsFileInput/uploadFilesToStorage";
import selectT from "@/utils/selectT";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInfo } from "./@types";
import { IPDFData } from "../../../../services/PDFReader/interfaces";

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

    const promise = async () => {
      const uploadedFiles = await uploadFilesToStorage({
        bankAccountId: currentBankAccount!.id,
        files: loadedFiles,
      });

      const response = await createTransactionsFromPDFResult({
        bankAccountId: currentBankAccount!.id,
        pdfReadResult: extractResponse.data,
        uploadedFiles: uploadedFiles,
      });
      return response;
    };

    const finalResponse = await handleToast(promise(), {
      defaultErrorMessage: {
        en: "Error generating transactions",
        pt: "Erro ao gerar transações",
      },
      loadingMessage: {
        en: "Generating transactions",
        pt: "Gerando Transações",
      },
      successMessage: {
        en: "Transactions generated successfully",
        pt: "Transações geradas com sucesso",
      },
    });

    console.log('finalResponse', finalResponse)
  }

  const onTransactionsLoaded = (result: PDF2JSONResponse) => {
    setExtractResponse(result);
  };

  const onFilesLoaded = (files: File[]) => {
    setLoadedFiles(files);
  };

  const extractResult = extractResponse?.data || null;

  const generalInfo = useMemo(() => {
    return getGeneralInfo(extractResult);
  }, [extractResult]);

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
                {selectT(currentLanguage, {
                  en: "Upload Transactions",
                  pt: "Enviar Transações",
                })}
              </Button>
              <Button
                disabled={!extractResponse?.data}
                onClick={() => setExtractResponse(null)}
                variant="outline"
              >
                {selectT(currentLanguage, {
                  en: "Redo",
                  pt: "Refazer",
                })}
              </Button>
            </>
          }
        >
          <>
            <If condition={!!extractResult}>
              <Then>
                <Tabs defaultValue="pdf-0" className="w-full">
                  <TabsList>
                    {!!generalInfo && (
                      <TabsTrigger value={"all"}>
                        {selectT(currentLanguage, {
                          en: "All",
                          pt: "Todos",
                        })}
                      </TabsTrigger>
                    )}
                    {extractResult?.map((_, pdfIndex) => {
                      const num = pdfIndex + 1;
                      return (
                        <TabsTrigger
                          key={"pdf-" + pdfIndex}
                          value={"pdf-" + pdfIndex}
                        >
                          {selectT(currentLanguage, {
                            en: "Extract " + num,
                            pt: "Extrato " + num,
                          })}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {!!generalInfo && (
                    <TabsContent value={"all"}>
                      <ExtractPage pdfData={generalInfo} pdfKey={"geral"} />
                    </TabsContent>
                  )}
                  {extractResult?.map((pdfData, pdfIndex) => {
                    const key = "pdf-" + pdfIndex;
                    return (
                      <TabsContent key={key} value={key}>
                        <ExtractPage pdfData={pdfData} pdfKey={pdfIndex} />
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </Then>
              <Else>
                <TransactionsFileInput
                  currentBankId={currentBankAccount!.id}
                  userId={currentUser!.id}
                  onFilesLoaded={onFilesLoaded}
                  onTransactionsLoaded={onTransactionsLoaded}
                  className="mb-4"
                />
              </Else>
            </If>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};

// --------------------------
// HELPERS
// --------------------------

const getGeneralInfo = (extractResult: PDF2JSONResponse["data"]) => {
  if (!extractResult) return null;
  return extractResult.reduce(
    (acc, entry, index) => {
      acc.totalCredit = acc.totalCredit + entry.totalCredit;
      acc.totalDebit = acc.totalDebit + entry.totalDebit;
      acc.income = acc.income + entry.income;

      acc.transactions = [...acc.transactions, ...entry.transactions];
      acc.transactions.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      return acc;
    },
    {
      income: 0,
      totalCredit: 0,
      totalDebit: 0,
      transactions: [],
    } as GeneralInfo
  );
};
