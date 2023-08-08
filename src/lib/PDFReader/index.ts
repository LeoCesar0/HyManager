import formidable from "formidable";
import { IPDFRawData } from "./rawDataTypes";
const PDFParser = require("pdf2json");

interface IRead {
  files: formidable.File[];
}

export class PDFReader {
  async read({ files }: IRead): Promise<IPDFRawData[]> {
    const filePromises: Promise<IPDFRawData | null>[] = [];

    files.forEach((file) => {
      const pdfPromise: Promise<IPDFRawData | null> = new Promise(
        (resolve, reject) => {
          const pdfParser = new PDFParser();

          pdfParser.on(
            "pdfParser_dataError",
            (errData: { parserError: any }) => {
              console.error(errData.parserError);
              console.log("errData -->", errData);
              reject(null);
            }
          );
          pdfParser.on("pdfParser_dataReady", (pdfRawData: IPDFRawData) => {
            // fs.writeFile("./pdf2json/test/F1040EZ.json", JSON.stringify(pdfData));

            resolve(pdfRawData);
          });
          // pdfParser.loadPDF("public/nu_pdf_fev.pdf");
          pdfParser.loadPDF(file.filepath);
        }
      );
      filePromises.push(pdfPromise);
    });

    const pdfResultsArray = await Promise.all(filePromises);
    return pdfResultsArray.filter((item) => item !== null) as IPDFRawData[];
  }
}
