// ex "10"
// ex "10.5"
// ex ","
// ex "."
// ex "-"

export const isNumericDigit = (value: string) => {
  if (!value || typeof value !== "string") return false;

  const regex = /^-?[0-9,.]*$/;

  return regex.test(value);
};
