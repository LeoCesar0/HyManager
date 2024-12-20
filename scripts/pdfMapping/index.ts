import { decodeText } from "../../src/services/PDFReader/parsers/nubank/decodeText";
import { TEST_CONFIG } from "../../src/static/testConfig";
import { compareStrings } from "../../src/utils/compareStrings";
import formidable from "formidable";
import { IPDFRawData } from "../../src/services/PDFReader/rawDataTypes";
import PDF2JSON from "pdf2json";
import fs from "fs";

interface IGetPDFRawData {
  file: formidable.File | { filepath: string };
  timeout?: number;
}

const entries = [
  {
    value: "5.297,16",
    key: "initialBalance",
  },
  {
    value: "+41,09",
    key: "income",
  },
  {
    value: "+5.203,75",
    key: "totalCredit",
  },
  {
    value: "-9.742,24",
    key: "totalDebit",
  },
  {
    value: "799,76",
    key: "finalBalance",
  },
];

type ResultingEntry = {
  key: string;
  value: string;
  coords: [number, number] | null;
};

const getPDFRawData = async ({ file, timeout = 105000 }: IGetPDFRawData) => {
  try {
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

const getPDFMapping = async () => {
  const rawPDFData = await getPDFRawData({
    file: { filepath: TEST_CONFIG.pdf["2023-06"].path },
  });

  if (!rawPDFData) {
    console.error("Error getting raw PDF data");
    return;
  }

  const pages = rawPDFData.Pages;

  const result: ResultingEntry[] = entries.map((entry) => ({
    ...entry,
    coords: null,
  }));

  pages.forEach(({ Texts }: any) => {
    Texts.forEach((textData: any) => {
      const text = decodeText(textData.R[0].T);

      entries.forEach(({ key, value }, entryIndex) => {
        if (compareStrings(text, value)) {
          result[entryIndex].coords = [textData.x, textData.y];
        }
      });
    });
  });

  const outputData = result.reduce((acc, entry) => {
    console.log(entry);
    acc[entry.key] = entry.coords;
    return acc;
  }, {} as any);

  fs.writeFileSync(
    "./scripts/pdfMapping/output.json",
    JSON.stringify(outputData, null, 2)
  );

  console.table(result);
};

getPDFMapping();
