
export const stringToNumericString = (value: string) => {
  let result = value.replace(/[^0-9.,-]/g, "");
  if(!result) result = "0"
  return result
};
