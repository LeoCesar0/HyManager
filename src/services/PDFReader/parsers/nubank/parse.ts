import {
  CreateTransaction,
  TransactionType,
} from "src/server/models/Transaction/schema";
import { IPDFData } from "../../interfaces";
import { IPDFRawData } from "../../rawDataTypes";
import { numericStringToNumber } from "@/utils/numericStringToNumber";
import { slugify } from "@/utils/app";
import { decodeText } from "./decodeText";

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
    const currentPDFTransactions: CreateTransaction[] = [];

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
          // console.log(
          //   "----------------- START TRANSACTIONS ---------------------"
          // );
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
          // console.log(
          //   "HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE HERE --> HERE <--"
          // );
          // console.log("tempTransaction -->", tempTransaction);
          // console.log("TextValue -->", textValue);
          // console.log("foundDate -->", foundDate);
          // console.log("foundDescriptionX -->", foundDescriptionX);
          // console.log("x -->", x);
          // console.log("--------------------------------");
          return;
        }

        if (foundDate) {
          tempTransaction = {
            date: foundDate,
          };
          // console.log("Step 1 - Found new Date");
          // console.log("textValue -->", textValue);
          // console.log("------------------------------------------------");
          return;
        }

        if (!tempTransaction || !tempTransaction.date) {
          // console.log("SKIPPED date -->", textValue);
          return;
        }

        /* ----------------------------- CHECK FOR TYPE ----------------------------- */

        if (!tempTransaction.type || prevTransactionAlreadyCompleted) {
          // HAS NOT ENTER IN TRANSACTION YET
          if (slugify(currentText) === slugify("Total de entradas")) {
            // console.log("Step 2 - Found New Type");
            // console.log("textValue -->", textValue);
            // console.log("----------------- CREDIT LIST ---------------------");
            tempTransaction = {
              date: tempTransaction.date,
              type: "credit",
            };
            return;
          }
          if (slugify(currentText) === slugify("Total de saídas")) {
            // console.log("Step 2");
            // console.log("textValue -->", textValue);
            // console.log("----------------- DEBIT LIST ---------------------");
            tempTransaction = {
              date: tempTransaction.date,
              type: "debit",
            };
            return;
          }
        }

        if (!tempTransaction.type) {
          // console.log("SKIPPED type -->", textValue);
          return;
        }
        if (foundDescriptionX) {
          tempTransaction = {
            date: tempTransaction.date,
            type: tempTransaction.type,
            description: currentText,
          };
          // console.log("Step 3 - Found new Description");
          // console.log("textValue -->", textValue);
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
          // console.log("textValue -->", textValue);
          // console.log("------------------------------------------------");
          return;
        }
        // AMOUNT

        if (!amount) {
          // console.log("SKIPPED amount -->", textValue);
          return;
        }
        // MAKE TRANSACTION OBJECT
        if (tempTransaction.type === "debit" && amount > 0) amount = -amount;
        tempTransaction = {
          date: tempTransaction.date,
          type: tempTransaction.type,
          description: tempTransaction.description,
          creditor: tempTransaction.creditor || "",
          amount: amount,
        };
        const date = tempTransaction.date!;

        // const slugId = makeTransactionSlug({
        //   date: date.toISOString(),
        //   amount: amount.toString(),
        //   idFromBank: "",
        //   creditor: tempTransaction.creditor || "",
        // });
        const transaction: CreateTransaction = {
          creditor: tempTransaction.creditor || "",
          description: tempTransaction.description || "",
          type: tempTransaction.type as TransactionType,
          amount: amount,
          bankAccountId: bankAccountId,
          date: date,
          // ...makeDateFields(date),
        };
        currentPDFTransactions.push(transaction);
        if (Texts[textIndex + 1]) {
          if (!afterTransXValues.includes(Texts[textIndex + 1].x)) {
            afterTransXValues.push(Texts[textIndex + 1].x);
          }
        }
        // console.log("Step 5 FINAL");
        // console.log("textValue -->", textValue);
        // console.log("Inserted tempTransaction -->", transaction);
        // console.log("------------------------------------------------");

        return;
      });

      // END PDF PAGE
      // tempTransaction = undefined;
    });
    // END PDF FILE
    currentPDFData.transactions = currentPDFTransactions;

    finalResult.push(currentPDFData);
  });

  console.table(finalResult);
  return finalResult;
}

function parseBrazilianDate(text: string) {
  const brazilianMonths = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
  };

  const parts = text.split(" ");
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0]);
  const stringMonth = parts[1].toUpperCase() as keyof typeof brazilianMonths;
  // Check that the month is valid (to avoid overflow problems, like "99 FEV" becoming "10 MAR")
  if (!(stringMonth in brazilianMonths)) {
    return false;
  }
  const month = brazilianMonths[stringMonth];
  const year = parseInt(parts[2]);

  if (!day || month === undefined || !year) return false;

  const date = new Date(year, month, day);

  // Check that the date is valid and matches the input (to avoid overflow problems, like "99 FEV 2023" becoming "10 MAR 2023")
  if (
    date &&
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year
  ) {
    return date;
  } else {
    return false;
  }
}

// const isAValidNumber = (value: string) => {
//   const regex = /^[0-9,.+\-]+$/; // ACCEPT ANY NUMBER, COMMA, DOT, MINUS, PLUS

//   return regex.test(value);
// };
