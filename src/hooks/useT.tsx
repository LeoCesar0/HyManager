import { Locale } from "@/@types/index";
import { useRouter } from "next/router";
import { LocalizedText } from "../@types/index";

const useT = (langObject: LocalizedText) => {
  const router = useRouter();
  if (!langObject) return "";

  const currentLanguage: Locale = (router.locale || Locale.en) as Locale;

  const text = langObject[currentLanguage] || "";

  return text;
};

export default useT;
