import { Locale } from "@types-folder/index";
import { useRouter } from "next/router";

type IUseT = {
  [key in Locale]: string;
};

const useT = (langObject: IUseT) => {
  const router = useRouter();
  if (!langObject) return "";

  const currentLanguage: Locale = (router.locale || Locale.en) as Locale;

  const text = langObject[currentLanguage] || "";

  return text;
};

export default useT;
