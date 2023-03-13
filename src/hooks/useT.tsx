import { useRouter } from "next/router";
import { Locale } from "../graphql/generated";

type IUseT = {
  [key in Locale]: string;
};

const useT = (langObject: IUseT) => {
  const router = useRouter();
  if (!langObject) return "";

  const currentLanguage: Locale = (router.locale || Locale.En) as Locale;

  const text = langObject[currentLanguage] || "";

  return text;
};

export default useT;
