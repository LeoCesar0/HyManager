import formidable from "formidable";
import { IPDFRawData } from "./rawDataTypes";
import fs from "fs";
const PDF2JSON = require("pdf2json");

interface IGetPDFRawData {
  file: formidable.File | { filepath: string };
  timeout?: number;
}

export const getPDFRawData = async ({
  file,
  timeout = 105000,
}: IGetPDFRawData) => {
  try {
    if (!fs.existsSync(file.filepath)) {
      console.log(`File ${file.filepath} does not exist.`);
      return null;
    }

    const data: Promise<IPDFRawData | null> = new Promise((resolve, reject) => {
      const reader = new PDF2JSON();

      const timer = setTimeout(() => {
        console.error("getPDFRawData timeout, no file was read");
        reject(null);
      }, timeout);

      reader.on("pdfParser_dataError", (errData: { parserError: any }) => {
        console.error("getPDFRawData dataError", errData.parserError);
        clearTimeout(timer);
        reject(null);
      });

      // --------------------------
      // ON SUCCESS
      // --------------------------

      reader.on("pdfParser_dataReady", (pdfRawData: IPDFRawData) => {
        console.log("DATA SUCCESS!");
        clearTimeout(timer);
        resolve(pdfRawData);
      });

      // --------------------------
      // LOAD
      // --------------------------

      reader.loadPDF(file.filepath);
    });

    return data;
  } catch (error) {
    console.log("READ ERROR", error);
    throw error;
  }
};
