export const getFilePath = ({
  userId,
  bankAccountId,
  fileId,
  file,
}: {
  userId: string;
  fileId: string;
  bankAccountId: string;
  file: File;
}) => {
  return `${userId}/${bankAccountId}/${fileId}`;
};
