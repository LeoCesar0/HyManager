import { getPDFRawData } from "@/services/PDFReader/getPDFRawData";
import { PDFDataSchema } from "@/services/PDFReader/interfaces";
import { TEST_CONFIG } from "@/static/testConfig";
import NubankPDFParser from "../NubankPDFParser";

describe("Test Nubank parse", () => {
  const parser = new NubankPDFParser();
  const bankAccountId = TEST_CONFIG.bankAccountId;

  test("valid return format", async () => {
    const pdfRawData = await getPDFRawData({
      file: {
        filepath: TEST_CONFIG.pdfs[0].path,
      },
    });

    expect(pdfRawData?.Pages).toBeTruthy();
    if (!pdfRawData) return;

    const pdfData = parser.parse([pdfRawData], bankAccountId);

    pdfData.forEach((data) => {
      const validation = PDFDataSchema.safeParse(data);
      if(!validation.success){
        console.log(data)
        console.error(validation.error.issues[0].message)
      }
      expect(validation.success).toBe(true);
    });

    expect(true).toBe(true);
  });
});
