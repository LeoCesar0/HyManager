import { FileWithId } from "@/@types/File";
import { v4 as uuid } from "uuid";

export const filesToFileWithId = (files: File[]): FileWithId[] => {
  const filesWithId = files.map((file) => {
    (file as FileWithId).id = uuid();
    return file as FileWithId;
  });

  return filesWithId;
};
