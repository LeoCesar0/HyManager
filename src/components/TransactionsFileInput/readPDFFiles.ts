import { ChangeEvent } from "react";

export interface IReadPDFFiles {
  event: ChangeEvent<HTMLInputElement>;
}

export const readPDFFiles = ({ event }: IReadPDFFiles) => {
  const fileList = event.target.files;
  if (!fileList) {
    return null;
  }
  const files: File[] = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList.item(i);
    if (file) {
      files.push(file);
    }
  }

  if (files.length === 0) return null;

  return files;
};
