import { TransactionType } from "@models/Transaction/schema";
import currency from "currency.js";
import { IPDFData } from "../../interfaces";

export const validateResults = (parsedResults: IPDFData[]) => {
  let valid = true;

  parsedResults.forEach((pdfResult, index) => {
    const totalsByTransactions = pdfResult.transactions.reduce(
      (acc, entry) => {
        if (entry.type === TransactionType.debit) {
          acc.totalDebit = currency(acc.totalDebit).add(entry.amount).value;
        }
        if (entry.type === TransactionType.deposit) {
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
      valid = false;
    }
    if (pdfResult.totalDebit !== totalsByTransactions.totalDebit) {
      console.log(
        `ERROR total DEBIT. Got ${totalsByTransactions.totalDebit}, expected ${pdfResult.totalDebit}`
      );
      valid = false;
    }

    const lastTrans = pdfResult.transactions[pdfResult.transactions.length - 1];
    const lastTransUpdatedValue = lastTrans?.updatedBalance ?? 0;
    const finalBalance = currency(lastTransUpdatedValue).add(
      pdfResult.income
    ).value;
    if (pdfResult.finalBalance !== finalBalance) {
      console.log(
        `ERROR updated balance. Got ${lastTransUpdatedValue}, expected ${pdfResult.finalBalance}`
      );
      valid = false;
    }
  });

  return valid;
};
