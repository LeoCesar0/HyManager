import { getPDFRawData } from "@/services/PDFReader/getPDFRawData";
import { PDFDataSchema } from "@/services/PDFReader/interfaces";
import { TEST_CONFIG } from "@/static/testConfig";
import NubankPDFParser from "../NubankPDFParser";

describe("Test Nubank parse", () => {
  const parser = new NubankPDFParser();
  const bankAccountId = TEST_CONFIG.bankAccountId;

  it("should be a valid return format", async () => {
    const pdfRawData = await getPDFRawData({
      file: {
        filepath: TEST_CONFIG.pdf['2023-06'].path,
      },
    });

    expect(pdfRawData?.Pages).toBeTruthy();

    if (!pdfRawData) return;

    const pdfData = parser.parse([pdfRawData], bankAccountId);

    pdfData.forEach((data) => {
      const validation = PDFDataSchema.safeParse(data);
      if (!validation.success) {
        console.log(data);
        console.error(validation.error.issues[0].message);
      }
      expect(validation.success).toBe(true);
    });
  });

  describe("should return the correct data", () => {
    // --------------------------
    // pdf 2023-06
    // --------------------------
    test("pdf 2023-06", async() => {
      const pdfRawData = await getPDFRawData({
        file: {
          filepath: TEST_CONFIG.pdf['2023-06'].path,
        },
      });
  
      if (!pdfRawData) return;
  
      const pdfData = parser.parse([pdfRawData], bankAccountId)[0];

      expect(pdfData.initialBalance).toBe(5297.16);
      expect(pdfData.finalBalance).toBe(799.76);
      expect(pdfData.income).toBe(41.09);
      expect(pdfData.totalCredit).toBe(5203.75);
      expect(pdfData.totalDebit).toBe(-9742.24);
      expect(pdfData.transactions.length).toBe(51);
    })
    // --------------------------
    // pdf 2023-07
    // --------------------------
    test("pdf 2023-07", async() => {
      const pdfRawData = await getPDFRawData({
        file: {
          filepath: TEST_CONFIG.pdf['2023-07'].path,
        },
      });
  
      if (!pdfRawData) return;
  
      const pdfData = parser.parse([pdfRawData], bankAccountId)[0];

      expect(pdfData.initialBalance).toBe(799.76);
      expect(pdfData.finalBalance).toBe(471.17);
      expect(pdfData.income).toBe(0.0);
      expect(pdfData.totalCredit).toBe(5537);
      expect(pdfData.totalDebit).toBe(-5865.59);
      expect(pdfData.transactions.length).toBe(39);
    })
  })
});
