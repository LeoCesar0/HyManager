import { NextApiHandler } from "next";
import { IPDFRawData } from "@/services/PDFReader/rawDataTypes";
const PDFParser = require("pdf2json");

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
        // fs.writeFile("./pdf2json/test/F1040EZ.json", JSON.stringify(pdfData));
        resolve(pdfData);
      });
      pdfParser.loadPDF("public/nu_pdf_fev.pdf");
    }
  );

  data = await pdfPromise;

  res.status(200).json({ data: data });
  return res;
};

export default handler;
