import CSVReader, { IFileInfo } from "react-csv-reader";
import { createManyTransactions } from "src/models/Transaction/mutateMany";
import { extractTransactionsFromCSVData } from "src/models/Transaction/utils";
import { handleToastPromise, showErrorToast } from "src/utils/app";

interface ITransactionsFileInput {
  currentBankId: string | undefined;
}

const TransactionsFileInput: React.FC<ITransactionsFileInput> = ({
  currentBankId,
}) => {
  const onFileLoaded = async (
    data: Array<any>,
    fileInfo: IFileInfo,
    originalFile: File | undefined
  ) => {
    console.log("raw data -->", data);
    if (currentBankId) {
      const results = extractTransactionsFromCSVData({
        data: data,
        bankAccountId: currentBankId,
      });
      const inputs = results.data;
      const errorMessage = results.error?.message;
      if (errorMessage) {
        showErrorToast({
          message: errorMessage,
        });
      }
      if (inputs) {
        try {
          const results = await handleToastPromise(
            createManyTransactions({
              transactionsValues: inputs,
              bankAccountId: currentBankId,
            }),
            { loadingMessage: "Loading TRANSACTIONS" }
          );
          // const results = await createManyTransactions({
          //   transactionsValues: inputs,
          // });
          console.log("Final Results -->", results);
        } catch (e) {
          console.log("createManyTransactions ERROR -->", e);
        }
      }
    }
  };

  return (
    <>
      <CSVReader onFileLoaded={onFileLoaded} />
    </>
  );
};

export default TransactionsFileInput;
