import { TransactionType } from "@models/Transaction/schema";
import currency from "currency.js";
import { IPDFData } from "../../interfaces";

export const validateResults = (
  parsedResults: IPDFData[],
  handleReject: () => void
) => {
  parsedResults.forEach((pdfResult, index) => {
    console.log("---> validateResults PDF " + index);

    const totalsByTransactions = pdfResult.transactions.reduce(
      (acc, entry) => {
        if (entry.type === TransactionType.debit) {
          acc.totalDebit = currency(acc.totalDebit).add(entry.amount).value;
        }
        if (entry.type === TransactionType.credit) {
          acc.totalCredit = currency(acc.totalCredit).add(entry.amount).value;
        }
        return acc;
      },
      {
        totalCredit: 0,
        totalDebit: 0,
      }
    );

    if (pdfResult.totalCredit !== totalsByTransactions.totalCredit) {
      console.log(
        `ERROR total CREDIT. Got ${totalsByTransactions.totalCredit}, expected ${pdfResult.totalCredit}`
      );
      handleReject();
    }
    if (pdfResult.totalDebit !== totalsByTransactions.totalDebit) {
      console.log(
        `ERROR total DEBIT. Got ${totalsByTransactions.totalDebit}, expected ${pdfResult.totalDebit}`
      );
      handleReject();
    }
  });
};
