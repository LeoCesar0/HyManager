export const isNumericString = (value: string) => {
  // only numbers, comma and dot

    if(!value || typeof value !== "string") return false

  const regex = /^[0-9,.]*$/;

  const hasMultiplesComma =
    value.split("").filter((item) => item === ",").length > 1;
  const hasMultiplesDots =
    value.split("").filter((item) => item === ".").length > 1;

  if (hasMultiplesComma && hasMultiplesDots) return false;

  return regex.test(value);
};
