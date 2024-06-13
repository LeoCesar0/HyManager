export const getFilePath = ({
  bankAccountId,
  fileId,
  file,
  baseFolder,
}: {
  fileId: string;
  bankAccountId: string;
  file: File;
  baseFolder?: string;
}) => {
  const fileName = file.name.split(".")[0];
  let path = `${bankAccountId}/${fileName}_${fileId}`;
  if (baseFolder) {
    path = `${baseFolder}/${path}`;
  }
  return path;
};
