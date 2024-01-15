import { AppModelResponse } from "@/@types";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFReader } from "@/services/PDFReader";
import { IPDFData } from "@/services/PDFReader/interfaces";
import NubankPDFParser from "@/services/PDFReader/parsers/nubank/NubankPDFParser";

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
        reject(response);
      };

      // --------------------------
      // Validations
      // --------------------------

      if (!bankAccountId) {
        handleReject("No bank account id provided");
      }

      if (err) {
        handleReject("Error reading pdf: formidable err");
      }
      if (!Array.isArray(files)) {
        files = [files];
      }

      // --------------------------
      // Read uploaded files
      // --------------------------

      await pdfReader.read({ files: files });

      const parsedResults = pdfReader.parse({ bankAccountId });

      // --------------------------
      // Validation
      // --------------------------

      if (!parsedResults) {
        handleReject("Error parsing pdf: No parsed results");
        resolve(files);
        return;
      }

      const valid = pdfDataParser.validateResults(parsedResults);

      if (!valid) {
        handleReject("Error parsing pdf: Invalid parsed results");
        resolve(files);
        return;
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
