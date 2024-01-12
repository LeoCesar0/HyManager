import { handler } from "@/pages/api/read-pdf-files";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { TEST_CONFIG } from "@/static/testConfig";
import httpMocks from "node-mocks-http";
import { PDF2JSONResponse } from "../readPdfFilesRoute";
import { OutgoingMessage } from "http";
import "isomorphic-fetch";
import "isomorphic-form-data";

describe("API Route: read-pdf-files", () => {
  it("should handle requests correctly", async () => {
    const formData = new FormData();
    const filePath = TEST_CONFIG.pdf["2023-06"].path;
    const bankAccountId = TEST_CONFIG.bankAccountId;

    formData.append("bankAccountId", bankAccountId);
    // @ts-ignore
    formData.append("files", fs.createReadStream(filePath));

    const res = await fetch("http://localhost:3000/api/read-pdf-files", {
      method: "POST",
      body: formData,
    });
    const resData = (await res.json()) as PDF2JSONResponse;
    console.log("resData", resData);

    expect(res.status).toBe(200);
    expect(res.statusText).toEqual("OK");

    expect(resData).toBeTruthy();
    expect(resData.data).toBeTruthy();
  }, 10000);
});

// describe("API Route: read-pdf-files", () => {
//   it("should handle requests correctly", async () => {
//     const formData = new FormData();
//     const filePath = TEST_CONFIG.pdf["2023-06"].path;
//     const bankAccountId = TEST_CONFIG.bankAccountId

//     const fileBuffer = fs.readFileSync(filePath);

//     const blob = new Blob([fileBuffer], { type: "application/pdf" });

//     formData.append("files", blob);
//     formData.append("bankAccountId", bankAccountId);

//     const { req, res } = httpMocks.createMocks({
//       method: "POST",
//       body: formData,
//     });
//     req.headers = {
//       "Content-Type": "multipart/form-data",
//     };

//     await handler(req as unknown as NextApiRequest, res as any);

//     expect(res.statusCode).toBe(200);
//     expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
//     expect(res.statusMessage).toEqual("OK");

//     const data = res._getJSONData() as PDF2JSONResponse;

//     console.log("data", data);

//     expect(data).toBeTruthy();
//     expect(data.data).toBeTruthy();
//   }, 10000);
// });
