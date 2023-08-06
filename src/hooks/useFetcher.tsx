import { useGlobalCache } from "@contexts/GlobalCache";
import { FirebaseCollection } from "@server/firebase";
import { AppModelResponse } from "@types-folder/index";
import { useState, useEffect, useCallback } from "react";

interface IProps<T> {
  cacheKey: string;
  fetcher: (...args: any[]) => Promise<AppModelResponse<T>>;
  stopAction?: boolean;
  collection: FirebaseCollection;
  dependencies: any[];
  initialData: T;
}

interface IState<T> {
  loading: boolean;
  data: T;
}

const useFetcher = <T,>(props: IProps<T>) => {
  const {
    cacheKey,
    fetcher,
    stopAction,
    collection,
    dependencies = [],
    initialData,
  } = props;

  const [state, setState] = useState<IState<T>>({
    loading: false,
    data: initialData,
  });

  const { loading } = state;

  const { caches, setCache, updateCacheFetcher } = useGlobalCache();

  const fetchData = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    fetcher()
      .then((result) => {
        if (result.data) {
          setCache({
            key: cacheKey,
            value: result.data,
            collection: collection,
            refetcher: fetchData,
          });
          setState((prev) => ({ ...prev, data: result.data as T }));
        }
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [fetcher]);

  useEffect(() => {
    updateCacheFetcher(cacheKey, fetchData);
  }, [fetchData]);

  useEffect(() => {
    if (stopAction || loading) return;
    const cachedData = caches.find((item) => item.key === cacheKey);

    if (!cachedData) {
      fetchData();
    } else {
      setState((prev) => ({ ...prev, data: cachedData.value }));
    }
  }, dependencies);

  return {
    ...state,
  };
};

export default useFetcher;
