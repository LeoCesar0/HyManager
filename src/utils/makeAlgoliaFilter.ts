export const makeAlgoliaFilter = ({
  bankAccountId,
  categoryFilter,
}: {
  categoryFilter: string[];
  bankAccountId: string;
}) => {
  let result = `bankAccountId:${bankAccountId}`;
  
  if (categoryFilter.length === 0) {
    return result;
  }

  result += " AND (";
  result += categoryFilter
    .map((category) => `categories:${category}`)
    .join(" OR ");
  result += ")";

  return result;
};
