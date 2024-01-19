import { Locale } from "@/@types/index";

const selectT = <T>(
  currentLanguage: Locale,
  langObject: Record<Locale, T>
): T => {
  const selected = langObject[currentLanguage];

  return selected;
};

export default selectT;
