"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { FirebaseCollection } from "src/models";

interface Cache {
  key: string;
  value: any;
  collection?: FirebaseCollection;
  refetcher: (...args: any[]) => void;
}

interface GlobalCacheProps {
  setState: Dispatch<SetStateAction<GlobalCacheProps>>;
  handleSetState: (newValues: {}) => void;
  setCache: (cache: Cache) => void;
  refetchCollection: (collection: FirebaseCollection[]) => void;
  caches: Cache[];
  collectionsToRefetch: FirebaseCollection[];
}
const initialValues = {
  caches: [] as Cache[],
  collectionsToRefetch: [] as FirebaseCollection[],
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

  const setCache = (cache: Cache) => {
    setState((prev) => ({
      ...prev,
      caches: [...prev.caches.filter((item) => item.key !== cache.key), cache],
    }));
  };

  const refetchCollection = (collections: FirebaseCollection[]) => {
    setState((prev) => ({
      ...prev,
      collectionsToRefetch: [...prev.collectionsToRefetch, ...collections],
    }));
  };

  useEffect(() => {
    const caches = state.caches;
    const collectionsToRefetch = state.collectionsToRefetch;

    if (collectionsToRefetch.length === 0) return;

    setState((prev) => ({
      ...prev,
      collectionsToRefetch: [],
    }));

    caches.forEach((cache) => {
      const shouldRefetch = collectionsToRefetch.find(
        (collection) => cache.collection === collection
      );
      if (shouldRefetch) {
        cache.refetcher();
        console.log("Refetching! -->", cache);
      }
    });
  }, [state.caches, state.collectionsToRefetch]);

  return (
    <GlobalCache.Provider
      value={{
        ...state,
        setState,
        handleSetState,
        setCache,
        refetchCollection,
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
