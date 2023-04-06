"use client";

import { Locale } from "@types-folder/index";
import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface GlobalCacheProps {
  setState: Dispatch<SetStateAction<GlobalCacheProps>>;
  handleSetState: (newValues: {}) => void;
  setCache: (key: string, value: any) => void;
  cache: { [key: string]: any };
}
const initialValues = {
  cache: {},
};

const GlobalCache = createContext<GlobalCacheProps>(
  initialValues as GlobalCacheProps
);

export const GlobalCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalCacheProps>(
    initialValues as GlobalCacheProps
  );

  const handleSetState = (newValues: {}) => {
    setState((prev) => ({ ...prev, ...newValues }));
  };

  const setCache = (key: string, value: any) => {
    setState((prev) => ({ ...prev, cache: { ...prev.cache, [key]: value } }));
  };

  return (
    <GlobalCache.Provider
      value={{
        ...state,
        setState,
        handleSetState,
        setCache,
      }}
    >
      {children}
    </GlobalCache.Provider>
  );
};

export const useGlobalCache = () => {
  const context = useContext(GlobalCache);

  return context;
};
