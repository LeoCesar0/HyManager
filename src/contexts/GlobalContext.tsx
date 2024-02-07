import { Locale } from "@/@types/index";
import { firebaseApp } from "@/services/firebase";
import { Locale as DateLocale } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { getPerformance } from "firebase/performance";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface GlobalContextProps {
  currentLanguage: Locale;
  currentDateLocale: DateLocale;
  menuIsOpen: boolean;
  setState: Dispatch<SetStateAction<GlobalContextProps>>;
  handleSetState: (newValues: {}) => void;
  toggleMenu: () => void;
  setLanguage: (lang: Locale) => void;
}
const initialValues = {
  currentLanguage: "en",
  currentDateLocale: enUS,
  menuIsOpen: false,
};
const GlobalContext = createContext<GlobalContextProps>(
  initialValues as GlobalContextProps
);

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [state, setState] = useState<GlobalContextProps>(
    initialValues as GlobalContextProps
  );

  const currentLanguage = (router.locale || Locale.en) as Locale;

  const handleSetState = (newValues: {}) => {
    setState((prev) => ({ ...prev, ...newValues }));
  };

  const toggleMenu = () => {
    setState((prev) => ({ ...prev, menuIsOpen: !prev.menuIsOpen }));
  };

  const setLanguage = (lang: Locale) => {
    setCookie(null, "NEXT_LOCALE", lang);
    router.push(router.pathname, undefined, { locale: lang, shallow: true });
  };

  useEffect(() => {
    const perf = getPerformance(firebaseApp)
  },[])

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        currentLanguage: currentLanguage,
        currentDateLocale: currentLanguage === "en" ? enUS : ptBR,
        setState,
        handleSetState,
        toggleMenu,
        setLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  return context;
};
