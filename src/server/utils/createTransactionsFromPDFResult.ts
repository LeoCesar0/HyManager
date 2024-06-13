import { FileInfo } from "@/@types/File";
import { createManyTransactions } from "@models/Transaction/create/createManyTransactions";
import { CreateTransactionFromPDF } from "@models/Transaction/schema";
import { IPDFData } from "@/services/PDFReader/interfaces";
import { makeTransactionSlug } from "./makeTransactionSlug";

interface ICreateTransactionsFromPDFResult {
  pdfReadResult: IPDFData[];
  uploadedFiles?: FileInfo[];
  bankAccountId: string;
}

export const createTransactionsFromPDFResult = async ({
  pdfReadResult,
  uploadedFiles,
  bankAccountId,
}: ICreateTransactionsFromPDFResult) => {
  const transactionsMap = new Map<string, CreateTransactionFromPDF>();
  const strengthByTransaction = new Map<string, number>();

  pdfReadResult.forEach(async (pdfResult) => {
    if (uploadedFiles) {
      const relativeFile = uploadedFiles.find(
        (item) => item.id === pdfResult.fileId
      );
      if (relativeFile) {
        pdfResult.transactions.forEach((transactionInput) => {
          const date = new Date(transactionInput.date);
          const slugId = makeTransactionSlug({
            date: transactionInput.date,
            amount: transactionInput.amount,
            idFromBank: transactionInput.idFromBank,
            creditor: transactionInput.creditor || "",
          });
          // Check if transaction already exists, if so, add only the transaction which pdfResult has more transactions
          const prevStrength = strengthByTransaction.get(slugId) || -1;
          const currentStrength = pdfResult.transactions.length;
          const canAdd = currentStrength > prevStrength;
          if (canAdd) {
            const transaction: CreateTransactionFromPDF = {
              ...transactionInput,
              file: relativeFile,
              date: date,
            };
            transactionsMap.set(slugId, transaction);
            strengthByTransaction.set(slugId, currentStrength);
          }
        });
      }
      if (!relativeFile) {
        console.error("No relative file found for transaction", pdfResult);
        window.alert("No relative file found for transaction");
        // TODO
      }
    }
  });

  const transactionsToCreate: CreateTransactionFromPDF[] = Array.from(
    transactionsMap.values()
  );

  const createResult = await createManyTransactions({
    bankAccountId,
    transactions: transactionsToCreate,
  });

  return createResult;
};
