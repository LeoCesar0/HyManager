import { PDF2JSONResponse } from "@/server/routes/readPdfFilesRoute";
import { AppModelResponse } from "../../@types/index";
import { IPDFData } from "../../services/PDFReader/interfaces";
import { FileWithId } from "@/@types/File";

export interface IExtractPDFData {
  bankAccountId: string;
  files: FileWithId[];
}

export const extractPDFData = async ({
  bankAccountId,
  files,
}: IExtractPDFData): Promise<AppModelResponse<IPDFData[]>> => {
  const formData = new FormData();

  const fileIds: string[] = [];

  files.forEach((file) => {
    formData.append("files", file);
    fileIds.push(file.id);
  });

  formData.append("bankAccountId", bankAccountId);
  formData.append("fileIds", JSON.stringify(fileIds));

  try {
    const res = await fetch("/api/read-pdf-files", {
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
