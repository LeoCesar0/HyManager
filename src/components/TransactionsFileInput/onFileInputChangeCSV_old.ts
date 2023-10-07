import { CSVData } from "@/@types";
import { openDataAsText } from "@utils/openDataAsText";
import { ChangeEvent, RefObject } from "react";
import { PDF2JSONResponse } from "src/pages/api/pdf2json";

export interface OnFileInputChangeProps {
  event: ChangeEvent<HTMLInputElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  currentBankId: string;
}

export interface FileInfo {
  file: File;
  data: CSVData;
}

export const onFileInputChange = async ({
  event,
  fileInputRef,
  currentBankId,
}: OnFileInputChangeProps) => {
  const files = event.target.files;
  if (!files) return;
  const transactionsFiles: FileInfo[] = [];
  const fileReadPromises: Promise<void>[] = [];
  const formData = new FormData();

  console.log("files -->", files);

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file) {
      formData.append("files", file);
      const fileReader = new FileReader();

      const promise = new Promise<void>((resolve) => {
        fileReader.onload = () => {
          const csvData = fileReader.result as string;
          const csvDataArrayForFile = csvData
            .split("\n")
            .map((row) => row.split(","));

          console.log("csvDataArrayForFile -->", csvDataArrayForFile);

          transactionsFiles.push({
            file: file,
            data: [...csvDataArrayForFile],
          });
          resolve();
        };
        fileReader.readAsText(file!);
      });

      fileReadPromises.push(promise);
    }
  }
  await Promise.all(fileReadPromises);

  // const allCSVData = transactionsFiles.map((item) => item.data);

  formData.append("bankAccountId", currentBankId);

  const res = await fetch("/api/pdf2json", {
    method: "POST",
    body: formData,
  });
  const result: PDF2JSONResponse = await res.json();

  openDataAsText(result);

  // window.open("data:text/json," + encodeURIComponent(result), "_blank");

  // formRef.current?.reset();

  fileInputRef.current!.value = "";

  // setSelectedFiles(transactionsFiles);
  // onFilesCSVDataReady(allCSVData)
};
