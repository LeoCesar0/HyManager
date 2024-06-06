import { AppModelResponse } from "@/@types";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFReader } from "@/services/PDFReader";
import { IPDFData } from "@/services/PDFReader/interfaces";
import NubankPDFParser from "@/services/PDFReader/parsers/nubank/NubankPDFParser";
import { listBankCreditors } from "@/server/models/BankCreditor/read/listBankCreditors";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import { getBankAccountById } from "@/server/models/BankAccount/read/getBankAccountById";
import { BankCategory } from "@/server/models/BankAccount/schema";
import { DEFAULT_CATEGORY } from "@/server/models/BankAccount/static";
import { slugify } from "@/utils/app";

export type PDF2JSONResponse = AppModelResponse<IPDFData[]>;

export const readPdfFilesRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<PDF2JSONResponse>
) => {
  const form = formidable({ multiples: true });
  const pdfDataParser = new NubankPDFParser();
  const pdfReader = new PDFReader({ parser: pdfDataParser });

  const readFilesPromise = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, { files }) => {
      const bankAccountId = fields.bankAccountId as string;

      // --------------------------
      // Handle Reject Function
      // --------------------------
      const handleReject = (errorMessage = "Error reading pdf") => {
        console.error("Reject -->", errorMessage);
        const response: PDF2JSONResponse = {
          error: { message: errorMessage },
          done: false,
          data: null,
        };
        res.status(400).json(response);
        return reject(response);
      };

      // --------------------------
      // Validations
      // --------------------------

      if (!bankAccountId) {
        return handleReject("No bank account id provided");
      }

      if (err) {
        return handleReject("Error reading pdf: formidable err");
      }
      if (!Array.isArray(files)) {
        files = [files];
      }

      // --------------------------
      // Read uploaded files
      // --------------------------

      await pdfReader.read({ files: files });

      let parsedResults = pdfReader.parse({ bankAccountId });

      // --------------------------
      // Validation
      // --------------------------

      if (!parsedResults) {
        return handleReject("Error parsing pdf: No parsed results");
      }

      // // --------------------------
      // // SYNC CREDITORS/CATEGORIES
      // // --------------------------

      const existingCreditors =
        (await listBankCreditors({ bankAccountId })).data || [];

      const existingCreditorsMap = existingCreditors.reduce<
        Map<string, BankCreditor>
      >((acc, item) => {
        acc.set(item.creditorSlug, item);
        return acc;
      }, new Map());

      parsedResults = parsedResults.map((results) => {
        results.transactions = results.transactions.map((transaction) => {
          const creditor = existingCreditorsMap.get(
            slugify(transaction.creditor)
          );
          if (transaction.creditor && creditor) {
            transaction.categories = creditor.categories;
          } else {
            if (
              !transaction.categories ||
              transaction.categories.length === 0
            ) {
              transaction.categories = [DEFAULT_CATEGORY["other-default"].id];
            }
          }
          return transaction;
        });
        return results;
      });

      // --------------------------
      // Validation
      // --------------------------

      const valid = pdfDataParser.validateResults(parsedResults);

      if (!valid) {
        return handleReject("Error parsing pdf: Invalid parsed results");
      }

      // --------------------------
      // Resolution
      // --------------------------

      res.status(200).json({
        data: parsedResults,
        done: true,
        error: null,
      });
      resolve(files);
    });
  });

  await readFilesPromise;

  return res;
};
