import { isNumericString } from "../checks/isNumericString";

export const numericStringToNumber = (string: string) => {
  if (string === "") string = "0";

  if (!string) return null;

  string = string.replace("+", "");
  string = string.replace(" ", "");

  if (!isNumericString(string)) {
    return null;
    // throw new Error(`string is not a numeric string --> ${string}`);
  }

  const hasComma = string.includes(",");
  const hasDot = string.includes(".");
  const hasMultiplesDots =
    string.split("").filter((item) => item === ".").length > 1;
  /* 
    ACCEPT THE FOLLOWING FORMATS AND CONVERT TO FLOAT
		1000.50
		1000
		2,200,100.50 --> NEED TO CONVERT
		2.200.100,50 --> NEED TO CONVERT
		1.100,50 --> NEED TO CONVERT
		1000,50 --> NEED TO CONVERT
    */
  if (hasMultiplesDots) {
    string = string.replaceAll(".", "");
    string = string.replaceAll(",", ".");
    return Number(string);
  }

  if (hasComma && !hasDot) {
    return Number(string.replaceAll(",", "."));
  }

  if (hasComma && hasDot) {
    const indexOfComma = string.indexOf(",");
    const indexOfDot = string.indexOf(".");
    if (indexOfComma < indexOfDot) {
      string = string.replaceAll(",", "");
      return Number(string);
    }
    if (indexOfComma > indexOfDot) {
      string = string.replaceAll(".", "");
      string = string.replaceAll(",", ".");
      return Number(string);
    }
  }

  return Number(string);
};
