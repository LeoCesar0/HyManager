import { createManyTransactions } from "@models/Transaction/create/createManyTransactions";
import { CreateTransaction } from "@models/Transaction/schema";
import { FirebaseCollection } from "@server/firebase";
import { extractTransactionsFromCSVData } from "@server/utils/extractTransactionsFromCSVData";
import { AppModelResponse, CSVData, RefetchCollection } from "@types-folder";
import { handleToastPromise, showErrorToast } from "@utils/app";

export const onFilesCSVDataReady = async (
  csvDataArray: CSVData[],
  currentBankId: string,
  refetchCollection: RefetchCollection
): Promise<AppModelResponse<{ id: string }[]>> => {
  const transactionsForEveryFile: CreateTransaction[] = [];

  if (!currentBankId) {
    return {
      data: null,
      done: false,
      error: { message: "Error reading data" },
    };
  }

  for (const csvData of csvDataArray) {
    const results = extractTransactionsFromCSVData({
      data: csvData,
      bankAccountId: currentBankId,
    });
    if (results.data) {
      transactionsForEveryFile.push(...results.data);
    } else {
      showErrorToast(results.error);
      return {
        data: null,
        done: false,
        error: { message: "Error reading data" },
      };
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
    return {
      data: null,
      done: false,
      error: { message: "Error reading data" },
    };
  }
};
