import { FileInfo } from "@/@types/File";
import { getFilePath } from "@utils/getFilePath";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "@/services/firebase";
import { v4 as uuid } from "uuid";

interface IUploadFilesToStorage {
  files: File[];
  bankAccountId: string;
  userId: string;
}

const uploadSingleFile = async (
  file: File,
  bankAccountId: string,
  userId: string
): Promise<FileInfo> => {
  const fileId = uuid();
  const path = getFilePath({ bankAccountId, file, fileId, userId });

  const storageRef = ref(firebaseStorage, path);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return {
    id: fileId,
    name: file.name,
    url,
  };
};

export const uploadFilesToStorage = async ({
  bankAccountId,
  files,
  userId,
}: IUploadFilesToStorage): Promise<FileInfo[]> => {
  return Promise.all(
    files.map((file) => uploadSingleFile(file, bankAccountId, userId))
  );
};
