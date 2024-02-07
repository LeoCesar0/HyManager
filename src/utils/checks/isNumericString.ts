// ex "-100.100,50"

import { isNumericDigit } from "./isNumericDigit";

export const isNumericString = (value: string) => {

  if (!value || typeof value !== "string") return false;


  const hasMultiplesComma =
    value.split("").filter((item) => item === ",").length > 1;
  const hasMultiplesDots =
    value.split("").filter((item) => item === ".").length > 1;

  if (hasMultiplesComma && hasMultiplesDots) return false;

  return isNumericDigit(value);
};
