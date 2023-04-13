import { useGlobalCache } from "@contexts/GlobalCache";
import { AppModelResponse } from "@types-folder/index";
import { useState, useEffect } from "react";
import { FirebaseCollection } from "src/models";

interface IProps<T> {
  cacheKey: string;
  fetcher: (...args: any[]) => Promise<AppModelResponse<any>>;
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
    dependencies,
    initialData,
  } = props;

  const [state, setState] = useState<IState<T>>({
    loading: false,
    data: initialData,
  });

  const { loading } = state;

  const { caches, setCache } = useGlobalCache();

  const fetchData = () => {
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
          setState((prev) => ({ ...prev, data: result.data }));
        }
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  };

  useEffect(() => {
    if (stopAction || loading) return;
    const cachedTransactions = caches.find((item) => item.key === cacheKey);

    if (!cachedTransactions) {
      fetchData();
    } else {
      setState((prev) => ({ ...prev, data: cachedTransactions.value }));
    }
  }, [...dependencies]);

  return {
    ...state,
  };
};

export default useFetcher;
