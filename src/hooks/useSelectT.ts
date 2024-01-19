import { Locale } from "@/@types/index";
import { useGlobalContext } from "@/contexts/GlobalContext";

const useSelectT = <T>(langObject: Record<Locale, T>): T => {
  const { currentLanguage } = useGlobalContext();

  const selected = langObject[currentLanguage];

  return selected;
};

export default useSelectT;
