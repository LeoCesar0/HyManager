import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Locale } from "../graphql/generated";

interface GlobalContextProps {
  currentLanguage: Locale;
  menuIsOpen: boolean;
  setState: Dispatch<SetStateAction<GlobalContextProps>>;
  handleSetState: (newValues: {}) => void;
  toggleMenu: () => void;
  setLanguage: (lang: Locale) => void
}
const initialValues = {
  currentLanguage: "en",
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

  const currentLanguage = (router.locale ?? Locale.En) as Locale;

  const handleSetState = (newValues: {}) => {
    setState((prev) => ({ ...prev, ...newValues }));
  };

  const toggleMenu = () => {
    setState((prev) => ({ ...prev, menuIsOpen: !prev.menuIsOpen }));
  };

  const setLanguage = (lang: Locale) => {
    router.push(router.pathname, undefined, { locale: lang, shallow: true });
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        currentLanguage: currentLanguage,
        setState,
        handleSetState,
        toggleMenu,
        setLanguage
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
