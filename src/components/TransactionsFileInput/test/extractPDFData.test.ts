import { TEST_CONFIG } from "@/static/testConfig";
import fs from "fs";

describe("Test extractPDFData", () => {
  test("load pdf file", async () => {
    let file: File;
    const pdfName = "nu.pdf";
    const bankAccountId = TEST_CONFIG.bankAccountId;

    expect(bankAccountId).toBeTruthy();

    await new Promise((resolve, reject) => {
      fs.readFile(
        "src/components/TransactionsFileInput/test/" + pdfName,
        (err, pdfBuffer) => {
          // pdfBuffer contains the file content
          if (err) {
            console.error("error fs:", err);
            reject();
          }

          const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

          file = new File([pdfBlob], pdfName, { type: 'application/pdf' });
          // file = new File([pdfBuffer], pdfName);
          resolve(pdfBuffer);
        }
      );
    });

    expect(file!).toBeTruthy();


  });

  //   afterEach(() => {
  //     fetchMock.restore();
  //   });

  //   test("extractPDFData sends correct request and returns data on success", async () => {
  //     const mockResponse = { data: [], done: true };
  //     fetchMock.post("/api/pdf2json", mockResponse);

  //     const result = await extractPDFData({
  //       bankAccountId: "123",
  //       files: [new File([], "test.pdf")],
  //     });

  //     expect(fetchMock).toHaveBeenLastCalledWith(
  //       "/api/pdf2json",
  //       expect.objectContaining({ method: "POST" })
  //     );
  //     expect(result).toEqual(mockResponse);
  //   });

  //   test("extractPDFData returns error on failure", async () => {
  //     fetchMock.post("/api/pdf2json", 500);

  //     const result = await extractPDFData({
  //       bankAccountId: "123",
  //       files: [new File([], "test.pdf")],
  //     });

  //     expect(fetchMock).toHaveBeenLastCalledWith(
  //       "/api/pdf2json",
  //       expect.objectContaining({ method: "POST" })
  //     );
  //     expect(result).toEqual({
  //       error: { message: "Error reading files" },
  //       data: null,
  //       done: false,
  //     });
  //   });
});
