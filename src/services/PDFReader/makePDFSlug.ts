export const makePDFSlug = ({
  startDate,
  endDate,
  bankAccountId,
}: {
  startDate: string;
  endDate: string;
  bankAccountId: string;
}) => {
  return `${startDate}-${endDate}-${bankAccountId}`;
};
