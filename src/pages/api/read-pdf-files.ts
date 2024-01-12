import { NextApiRequest, NextApiResponse } from "next";
import {
  PDF2JSONResponse,
  readPdfFilesRoute,
} from "@/server/routes/readPdfFilesRoute";
import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import NubankPDFParser from "@/services/PDFReader/parsers/nubank/NubankPDFParser";
import { PDFReader } from "@/services/PDFReader";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PDF2JSONResponse>
) => {
  console.log("ENTER HANDLER");

  const form = formidable({ multiples: true });
  const pdfDataParser = new NubankPDFParser();
  const pdfReader = new PDFReader({ parser: pdfDataParser });

  console.log("ENTER READ PDF FILES ROUTE");

  const readFilesPromise = new Promise((resolve, reject) => {
    console.log("ENTER PROMISE");
    form.parse(req, async (err, fields, { files }) => {
      console.log("ENTER PARSE");
      console.log("fields", fields);
      console.log("files", files);
      const bankAccountId = fields.bankAccountId as string;
      console.log("bankAccountId", bankAccountId);

      // console.log('files', files.toString())

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

      if (err) {
        console.error(err)
        handleReject("Error reading pdf: formidable err");
        return;
      }

      if (!bankAccountId) {
        handleReject("No bank account id provided");
        return;
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

  // return await readPdfFilesRoute(req, res);
};

export default handler;
