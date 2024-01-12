import { TEST_CONFIG } from "@/static/testConfig";
import fs from "fs";

describe("Test extractPDFData", () => {
  test("load pdf file", async () => {
    let file: File;
    const bankAccountId = TEST_CONFIG.bankAccountId;

    expect(bankAccountId).toBeTruthy();

    // await new Promise((resolve, reject) => {
    //   fs.readFile(TEST_CONFIG.pdfs[0].path, (err, pdfBuffer) => {
    //     const file = new File([pdfBuffer], "nu.pdf", {
    //       type: "application/pdf",
    //     });

    //     // pdfBuffer contains the file content
    //     const pdfName = "nu.pdf";

    //     if (err) {
    //       console.error("error fs:", err);
    //       reject();
    //     }

    //     const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    //     file = new File([pdfBlob], pdfName, { type: "application/pdf" });
    //     // file = new File([pdfBuffer], pdfName);
    //     resolve(pdfBuffer);
    //   });
    // });

    // expect(file!).toBeTruthy();
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
