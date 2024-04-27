import { FileInfo } from "@/@types/File";
import { CreateTransaction } from "@models/Transaction/schema";
import { IPDFData } from "@/services/PDFReader/interfaces";
import cloneDeep from "lodash.clonedeep";
import { writeBatch } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { TransactionReport } from "../models/TransactionReport/schema";

interface ICreateTransactionsFromPDFResult {
  pdfReadResult: IPDFData[];
  uploadedFiles: FileInfo[];
  bankAccountId: string;
}

export const createTransactionsFromPDFResult = async ({
  pdfReadResult,
  uploadedFiles,
  bankAccountId,
}: ICreateTransactionsFromPDFResult) => {
  const reportTypes: TransactionReport["type"][] = ["month", "day"];
  const batch = writeBatch(firebaseDB);

  const transactionsByMonth: Record<string, CreateTransaction[]> = {};

  pdfReadResult.forEach(async (pdfResult, index) => {
    const relativeFile = uploadedFiles[index];
    // GET RELATIVE FILE TO EACH TRANSACTION
    if (relativeFile) {
      // --------------------------
      // FOR THIS PDF
      // --------------------------
      const transactions = pdfResult.transactions;
      const transactionsToCreate: CreateTransaction[] = [];

      transactions.forEach((transaction) => {
        const values = cloneDeep(transaction);
        const date = new Date(values.date);

        transactionsToCreate.push({
          ...values,
          file: relativeFile,
          date: date,
        });
      });

      
      // transactions.forEach((transaction) => {
      //   const values = cloneDeep(transaction);
      //   const date = new Date(values.date);

      //   transactionsToCreate.push({
      //     ...values,
      //     file: relativeFile,
      //     date: date,
      //   });
      // });

      // --------------------------
      // REPORT FOR MONTH
      // --------------------------
    }
  });
};
