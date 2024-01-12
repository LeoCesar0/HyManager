import { PDF2JSONResponse } from "@/server/routes/readPDFRoute";
import { AppModelResponse } from "../../@types/index";
import { IPDFData } from "../../services/PDFReader/interfaces";

export interface IExtractPDFData {
  bankAccountId: string;
  files: File[];
}

export const extractPDFData = async ({
  bankAccountId,
  files,
}: IExtractPDFData): Promise<AppModelResponse<IPDFData[]>> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("bankAccountId", bankAccountId);

  try {
    const res = await fetch("/api/pdf2json", {
      method: "POST",
      body: formData,
    });
    const readResult: PDF2JSONResponse = await res.json();

    return readResult;
  } catch (e) {
    return {
      error: { message: "Error reading files" },
      data: null,
      done: false,
    };
  }
};
