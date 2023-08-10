import { createManyTransactions } from "@models/Transaction/create/createManyTransactions";
import { CreateTransaction } from "@models/Transaction/schema";
import { ChangeEvent, RefObject } from "react";
import { PDF2JSONResponse } from "src/pages/api/pdf2json";
import { uploadFilesToStorage } from "./uploadFilesToStorage";

export interface OnFileInputChangeProps {
  event: ChangeEvent<HTMLInputElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  bankAccountId: string;
  userId: string;
}

export const onFileInputChange = async ({
  event,
  fileInputRef,
  bankAccountId,
  userId,
}: OnFileInputChangeProps) => {
  const fileList = event.target.files;
  if (!fileList) {
    return {
      data: null,
      error: {
        message: "No files detected",
      },
      done: false,
    };
  }
  const files: File[] = [];
  const formData = new FormData();

  console.log("files -->", fileList);

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList.item(i);
    if (file) {
      files.push(file);
      formData.append("files", file);
    }
  }

  const uploadedFiles = await uploadFilesToStorage({
    bankAccountId,
    files,
    userId,
  });

  // uploadedFiles.forEach((item) => {
  //   formData.append("files", item.file);
  // });

  formData.append("bankAccountId", bankAccountId);
  formData.append("uploadedFiles", JSON.stringify(uploadedFiles));

  console.log("uploadedFiles -->", uploadedFiles);

  const res = await fetch("/api/pdf2json", {
    method: "POST",
    body: formData,
  });
  const readResult: PDF2JSONResponse = await res.json();

  // openDataAsText(result);

  fileInputRef.current!.value = "";

  if (readResult.data) {
    const transactionsToCreate: CreateTransaction[] = [];

    readResult.data.forEach((pdfResult, index) => {
      const relativeFile = uploadedFiles[index];
      // GET RELATIVE FILE TO EACH TRANSACTION
      pdfResult.transactions.forEach((transaction) => {
        transactionsToCreate.push({
          ...transaction,
          file: relativeFile,
        });
      });
    });

    const createResult = createManyTransactions({
      bankAccountId,
      transactions: transactionsToCreate,
    });

    return createResult;
  } else {
    return {
      error: { message: "Error reading files" },
      data: null,
      done: false,
    };
  }

  // formRef.current?.reset();
};
