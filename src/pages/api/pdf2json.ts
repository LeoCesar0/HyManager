import { TransactionType } from "@models/Transaction/schema";
import { AppModelResponse } from "@types-folder";
import currency from "currency.js";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFReader } from "src/lib/PDFReader";
import { IPDFData } from "src/lib/PDFReader/interfaces";
import NubankPDFParser from "src/lib/PDFReader/parsers/Nubank/NubankPDFParser";

export const config = {
  api: {
    bodyParser: false,
  },
};

export type PDF2JSONResponse = AppModelResponse<IPDFData[]>;

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PDF2JSONResponse>
) => {
  const form = formidable({ multiples: true });
  const pdfReader = new PDFReader();
  const pdfDataParser = new NubankPDFParser();

  const readFilesPromise = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, { files }) => {
      const bankAccountId = fields.bankAccountId as string;

      const handleReject = (errorMessage = "Error reading pdf") => {
        console.log("Reject -->", errorMessage);
        const response = {
          error: { message: errorMessage },
          done: false,
          data: null,
        };
        res.status(400).json(response);
        reject(response);
      };

      if (!bankAccountId) {
        handleReject("No bank account id provided");
      }

      if (err) {
        handleReject();
      }
      if (!Array.isArray(files)) {
        files = [files];
      }

      const rawData = await pdfReader.read({ files: files });

      const parsedResults = pdfDataParser.parse(rawData, bankAccountId);

      pdfDataParser.validateResults(parsedResults, handleReject);

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

export default handler;
