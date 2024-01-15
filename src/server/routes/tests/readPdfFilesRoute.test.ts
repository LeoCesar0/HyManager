import { handler } from "@/pages/api/read-pdf-files";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { TEST_CONFIG } from "@/static/testConfig";
import { PDF2JSONResponse } from "../readPdfFilesRoute";
import { PDFDataSchema } from "@/services/PDFReader/interfaces";
import "isomorphic-fetch";
import "isomorphic-form-data";
import { z } from "zod";

describe("API Route: read-pdf-files", () => {
  describe("Test 2023-06 pdf", () => {
    let res: Response;
    let resData: PDF2JSONResponse;

    beforeEach(async () => {
      const formData = new FormData();
      const filePath = TEST_CONFIG.pdf["2023-06"].path;
      const bankAccountId = TEST_CONFIG.bankAccountId;

      formData.append("bankAccountId", bankAccountId);
      // @ts-ignore
      formData.append("files", fs.createReadStream(filePath));

      res = await fetch("http://localhost:3000/api/read-pdf-files", {
        method: "POST",
        body: formData,
      });
      resData = (await res.json()) as PDF2JSONResponse;
    }, 10000);

    it("should handle requests correctly", (done) => {
      expect(res.status).toBe(200);
      expect(res.statusText).toEqual("OK");
      expect(resData).toBeTruthy();
      done();
    }, 10000);

    it("should return valid values", (done) => {
      // resData.data?.forEach((pdfData) => {
      //   pdfData.transactions.forEach((trans) => {
      //   });
      // });
      const validation = z.array(PDFDataSchema).safeParse(resData.data);
      if (!validation.success)
        console.log(
          "errors",
          validation.error.issues.map((i) => i.message)
        );
      expect(validation.success).toBe(true);
      done();
    }, 10000);
  });
});
