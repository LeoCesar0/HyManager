import { normalizeString } from "./normalizeString";

export const compareStrings = (string1: string, string2: string) => {
  return normalizeString(string1) === normalizeString(string2);
};
