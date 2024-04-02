export const makeBankCreditorId = ({
  creditorSlug,
  bankAccountId,
}: {
  creditorSlug: string;
  bankAccountId: string;
}) => {
  return `${bankAccountId}@@${creditorSlug}`;
};
