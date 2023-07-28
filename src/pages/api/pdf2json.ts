import currency from "currency.js";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFReader } from "src/lib/PDFReader";
import NubankPDFParser from "src/lib/PDFReader/parsers/NubankPDFParser";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: true });
  const pdfReader = new PDFReader();
  const pdfDataParser = new NubankPDFParser();

  const readFilesPromise = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, { files }) => {
      const bankAccountId = fields.bankAccountId as string;

      if (!bankAccountId) {
        res
          .status(400)
          .json({
            error: "No bank account id provided",
            done: false,
            data: null,
          });
        reject(err);
      }

      if (err) {
        res
          .status(400)
          .json({ error: "Error parsing form", done: false, data: null });
        reject(err);
        return;
      }
      if (!Array.isArray(files)) {
        files = [files];
      }

      const rawData = await pdfReader.read({ files: files });

      const parsedResult = pdfDataParser.parse(rawData, bankAccountId);

      const amount = parsedResult[0].transactions.reduce((acc, entry) => {
        acc = currency(acc).add(entry.amount).value
        return acc;
      }, 0);

      parsedResult.forEach((pdf, index) => {
        console.log('---> RESUMO PDF ' + index)
        console.log("transactions num -->", pdf.transactions.length);
        console.log("amount -->", amount);
        console.log("Expect amount -->", currency(pdf.totalCredit).add(pdf.totalDebit).value)
      })
      

      res.status(200).json(parsedResult);
      resolve(files);
    });
  });

  await readFilesPromise;

  return res;
};

export default handler;
