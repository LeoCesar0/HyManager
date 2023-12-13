import { PDF2JSONResponse } from "@/pages/api/pdf2json";
import { uploadFilesToStorage } from "./uploadFilesToStorage";
import { AppModelResponse } from '../../@types/index';
import { IPDFData } from '../../lib/PDFReader/interfaces';

export interface IExtractPDFData {
  bankAccountId: string;
  userId: string;
  files: File[];
}

export const extractPDFData = async ({
  bankAccountId,
  userId,
  files,
}: IExtractPDFData): Promise<AppModelResponse<IPDFData[]>> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("bankAccountId", bankAccountId);
  // formData.append("uploadedFiles", JSON.stringify(uploadedFiles));

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
