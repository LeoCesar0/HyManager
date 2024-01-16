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
  uploadedFiles: FileInfo[];
  bankAccountId: string;
}

export const createTransactionsFromPDFResult = async ({
  pdfReadResult,
  uploadedFiles,
  bankAccountId,
}: ICreateTransactionsFromPDFResult) => {
  const transactionsToCreate: CreateTransaction[] = [];

  pdfReadResult.forEach(async (pdfResult, index) => {
    const { initialBalance } = pdfResult;

    const reportDate = new Date(pdfResult.transactions[0].date);

    const types: TransactionReport["type"][] = ["month", "day"];

    for (const type of types) {
      await createTransactionReport({
        transactionReport: {
          amount: 0,
          bankAccountId,
          type: type,
          initialBalance: initialBalance,
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          id: "willBeReplaced",
          finalBalance: 0,
          transactions: [],
          date: Timestamp.fromDate(reportDate),
          ...makeDateFields(reportDate),
        },
      });
    }

    const relativeFile = uploadedFiles[index];
    // GET RELATIVE FILE TO EACH TRANSACTION
    pdfResult.transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      transactionsToCreate.push({
        ...transaction,
        file: relativeFile,
        date: date
      });
    });
  });

  const createResult = await createManyTransactions({
    bankAccountId,
    transactions: transactionsToCreate,
  });

  return createResult;
};
