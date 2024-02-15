import { FileInfo } from "@/@types/File";
import { createManyTransactions } from "@models/Transaction/create/createManyTransactions";
import { CreateTransaction, TransactionType } from "@models/Transaction/schema";
import { createTransactionReport } from "@models/TransactionReport/create/createTransactionReport";
import { TransactionReport } from "@models/TransactionReport/schema";
import { Timestamp } from "firebase/firestore";
import { IPDFData } from "@/services/PDFReader/interfaces";
import { makeDateFields } from "@/utils/date/makeDateFields";

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
  const transactionsToCreate: CreateTransaction[] = [];

  pdfReadResult.forEach(async (pdfResult, index) => {
    if (uploadedFiles) {
      const relativeFile = uploadedFiles[index];
      // GET RELATIVE FILE TO EACH TRANSACTION
      if (relativeFile) {
        pdfResult.transactions.forEach((transaction) => {
          const date = new Date(transaction.date);
          transactionsToCreate.push({
            ...transaction,
            file: relativeFile,
            date: date,
          });
        });
      }
    }
  });

  const createResult = await createManyTransactions({
    bankAccountId,
    transactions: transactionsToCreate,
  });

  return createResult;
};
