export const getFilePath = ({
  bankAccountId,
  fileId,
  file,
}: {
  fileId: string;
  bankAccountId: string;
  file: File;
}) => {
  const fileName = file.name.split('.')[0]
  return `${bankAccountId}/${fileName}_${fileId}`;
};
