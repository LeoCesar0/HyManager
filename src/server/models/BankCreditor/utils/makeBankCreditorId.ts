export const makeBankCreditorId = ({
  creditorSlug,
  bankAccountId,
}: {
  creditorSlug: string;
  bankAccountId: string;
}) => {
  let firstPart = bankAccountId;
  if (bankAccountId.length > 10) {
    const bankIdFirstPart = bankAccountId.slice(0, 5);
    const bankIdLastPart = bankAccountId.slice(-5);
    firstPart = `${bankIdFirstPart}-${bankIdLastPart}`;
  }
  return `${firstPart}@@${creditorSlug}`;
};
