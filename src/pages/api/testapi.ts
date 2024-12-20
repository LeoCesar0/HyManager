import { NextApiHandler } from "next";
import { IPDFRawData } from "@/services/PDFReader/rawDataTypes";
import { TEST_CONFIG } from "@/static/testConfig";
import PDFParser from "pdf2json";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export const handler: NextApiHandler = async (req, res) => {
  let data: any = {};
  const pdfPromise: Promise<IPDFRawData | null> = new Promise(
    (resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData: { parserError: any }) => {
        console.error(errData.parserError);
        console.log("errData -->", errData);
        reject(null);
      });
      pdfParser.on("pdfParser_dataReady", (pdfData: IPDFRawData) => {
        resolve(pdfData);
      });
      pdfParser.loadPDF(TEST_CONFIG.pdf["2023-06"].path);
    }
  );

  data = await pdfPromise;

  res.status(200).json({ data: data });
  return res;
};

export default handler;
