import { getPDFRawData } from "@/services/PDFReader/getPDFRawData";
import NubankPDFParser from "@/services/PDFReader/parsers/nubank/NubankPDFParser";
import { IPDFRawData } from "@/services/PDFReader/rawDataTypes";
import { TEST_CONFIG } from "@/static/testConfig";

export const getTestPDFData = async ({
  filePathList,
}: {
  filePathList: string[];
}) => {
  const parser = new NubankPDFParser();
  const bankAccountId = TEST_CONFIG.bankAccountId;

  const filePromises: Promise<IPDFRawData | null>[] = [];

  filePathList.forEach(async (path) => {
    const pdfRawData = getPDFRawData({
      file: {
        filepath: path,
      },
    });
    filePromises.push(pdfRawData);
  });

  const pdfResultsArray = await Promise.all(filePromises);

  const pdfRawDataList = pdfResultsArray.filter(
    (item) => item !== null
  ) as IPDFRawData[];

  const pdfData = parser.parse(pdfRawDataList, bankAccountId);

  return pdfData;
};
