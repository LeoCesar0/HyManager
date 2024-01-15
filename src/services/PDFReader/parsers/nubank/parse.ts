import {
  CreateTransaction,
  CreateTransactionFromPDF,
  TransactionType,
} from "src/server/models/Transaction/schema";
import { IPDFData } from "../../interfaces";
import { IPDFRawData } from "../../rawDataTypes";
import { numericStringToNumber } from "@/utils/numericStringToNumber";
import { slugify } from "@/utils/app";
import { decodeText } from "./decodeText";
import { parseBrazilianDate } from "@/utils/date/parseBrazilianDate";

const headerMapping = {
  initialBalance: [20.921, 9.97],
  income: [20.921, 11.22],
  totalCredit: [20.921, 12.469],
  totalDebit: [20.921, 13.718],
  finalBalance: [20.921, 14.972],
};

const transactionDescriptionX = 7.252;

const axisMap: Map<string, string> = new Map();

Object.entries(headerMapping).forEach(([key, value]) => {
  axisMap.set(value[1].toString(), key);
});

export function parse(
  PDFsRawData: IPDFRawData[],
  bankAccountId: string
): IPDFData[] {
  const finalResult: IPDFData[] = [];

  let afterTransXValues: number[] = [];

  PDFsRawData.forEach((rawPDFData) => {
    const currentPDFTransactions: CreateTransactionFromPDF[] = [];

    let currentPDFData: IPDFData = {
      finalBalance: 0,
      income: 0,
      initialBalance: 0,
      totalCredit: 0,
      totalDebit: 0,
      transactions: [],
    };

    const { Pages } = rawPDFData;

    let checkingTransactions = false;

    let tempTransaction:
      | undefined
      | {
          date?: Date;
          description?: string;
          creditor?: string;
          amount?: number;
          type?: "debit" | "credit";
        } = undefined;

    Pages.forEach(({ Texts }, pageIndex) => {
      Texts.forEach((textData, textIndex) => {
        const { R, x, y } = textData;
        const rawText = R[0].T || "";
        const currentText = decodeText(rawText);
        let headerKey = axisMap.get(y.toString()) as keyof IPDFData;

        let prevTransactionAlreadyCompleted =
          tempTransaction && typeof tempTransaction.amount === "number";
        const foundDescriptionX = x === transactionDescriptionX;

        if (currentText === "Movimentações") {
          checkingTransactions = true;
          // --------------------------
          // START TRANSACTIONS
          // --------------------------
        }

        if (pageIndex === 0 && !checkingTransactions) {
          /* ---------------------------- CHECK FIRST PAGE INFO ---------------------------- */
          const amount = numericStringToNumber(currentText);
          if (headerKey && amount !== null) {
            // @ts-ignore
            currentPDFData[headerKey] = amount;
            return;
          }
        }
        if (!checkingTransactions) {
          return;
        }

        /* --------------------------- CHECK TRANSACTIONS --------------------------- */
        const foundDate = parseBrazilianDate(currentText);

        if (
          prevTransactionAlreadyCompleted &&
          !foundDate &&
          !foundDescriptionX
        ) {
          // console.log("--------------------------------");
          return;
        }

        if (foundDate) {
          tempTransaction = {
            date: foundDate,
          };
          // console.log("Step 1 - Found new Date");
          // console.log("------------------------------------------------");
          return;
        }

        if (!tempTransaction || !tempTransaction.date) {
          return;
        }

        /* ----------------------------- CHECK FOR TYPE ----------------------------- */

        if (!tempTransaction.type || prevTransactionAlreadyCompleted) {
          // HAS NOT ENTER IN TRANSACTION YET
          if (slugify(currentText) === slugify("Total de entradas")) {
            // console.log("Step 2 - Found New Type");
            // console.log("----------------- CREDIT LIST ---------------------");
            tempTransaction = {
              date: tempTransaction.date,
              type: "credit",
            };
            return;
          }
          if (slugify(currentText) === slugify("Total de saídas")) {
            // console.log("Step 2");
            // console.log("----------------- DEBIT LIST ---------------------");
            tempTransaction = {
              date: tempTransaction.date,
              type: "debit",
            };
            return;
          }
        }

        if (!tempTransaction.type) {
          return;
        }
        if (foundDescriptionX) {
          tempTransaction = {
            date: tempTransaction.date,
            type: tempTransaction.type,
            description: currentText,
          };
          // console.log("Step 3 - Found new Description");
          // console.log("------------------------------------------------");
          return;
        }

        if (!tempTransaction.description) {
          // console.log("SKIPPED description -->", textValue);
          return;
        }

        let amount = numericStringToNumber(currentText);

        if (!tempTransaction.creditor && !amount) {
          let creditor = currentText;
          let i = textIndex;
          while (Texts[i + 1] && Texts[i + 1].x === transactionDescriptionX) {
            const text = decodeText(Texts[i + 1].R[0].T);
            creditor += text;
            i++;
          }

          tempTransaction = {
            date: tempTransaction.date,
            type: tempTransaction.type,
            description: tempTransaction.description,
            creditor: creditor,
          };
          // console.log("Step 4 - Found new Creditor");
          // console.log("------------------------------------------------");
          return;
        }
        // AMOUNT

        if (!amount) {
          // console.log("SKIPPED amount -->", textValue);
          return;
        }
        // MAKE TRANSACTION OBJECT
        // --------------------------
        // MAKE TRANSACTION OBJECT
        // --------------------------
        if (tempTransaction.type === "debit" && amount > 0) amount = -amount;
        tempTransaction = {
          date: tempTransaction.date,
          type: tempTransaction.type,
          description: tempTransaction.description,
          creditor: tempTransaction.creditor || "",
          amount: amount,
        };
        const date = tempTransaction.date!;


        const transaction: CreateTransactionFromPDF = {
          creditor: tempTransaction.creditor || "",
          description: tempTransaction.description || "",
          type: tempTransaction.type as TransactionType,
          amount: amount,
          bankAccountId: bankAccountId,
          date: date,
        };
        currentPDFTransactions.push(transaction);
        if (Texts[textIndex + 1]) {
          if (!afterTransXValues.includes(Texts[textIndex + 1].x)) {
            afterTransXValues.push(Texts[textIndex + 1].x);
          }
        }

        return;
      });

      // --------------------------
      // END OF PAGE
      // --------------------------

      // tempTransaction = undefined;
    });
    // --------------------------
    // END OF ILE
    // --------------------------
    currentPDFData.transactions = currentPDFTransactions;

    finalResult.push(currentPDFData);
  });

  return finalResult;
}



// const isAValidNumber = (value: string) => {
//   const regex = /^[0-9,.+\-]+$/; // ACCEPT ANY NUMBER, COMMA, DOT, MINUS, PLUS

//   return regex.test(value);
// };
