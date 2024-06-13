import formidable from "formidable";
import { getPDFRawData } from "./getPDFRawData";
import { IPDFData, IPDFDataParser } from "./interfaces";
import { IPDFRawData } from "./rawDataTypes";

interface IRead {
  files: formidable.File[];
}

interface IPDFReaderConstructor {
  parser: IPDFDataParser;
}

export class PDFReader {
  parser: IPDFDataParser;
  rawData: IPDFRawData[] | null = null;
  parsedData: IPDFData[] | null = null;

  constructor({ parser }: IPDFReaderConstructor) {
    this.parser = parser;
  }

  async read({ files }: IRead): Promise<IPDFRawData[]> {
    const filePromises: Promise<IPDFRawData | null>[] = [];

    files.forEach(async (file) => {
      const pdfRawData = getPDFRawData({ file });
      filePromises.push(pdfRawData);
    });

    const pdfResultsArray = await Promise.all(filePromises);

    this.rawData = pdfResultsArray.filter(
      (item) => item !== null
    ) as IPDFRawData[];

    return this.rawData;
  }
  parse({ bankAccountId, fileIds }: { bankAccountId: string, fileIds:string[] }) {
    if (!this.rawData) return null;
    const parsedResults = this.parser.parse(this.rawData, bankAccountId, fileIds);
    this.parsedData = parsedResults;
    return parsedResults;
  }
}
