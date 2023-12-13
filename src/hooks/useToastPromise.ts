import { useGlobalContext } from "../contexts/GlobalContext";
import { LocalizedText, AppModelResponse } from "../@types/index";
import { useState } from "react";
import { handleToastPromise } from "@utils/app";

export function useToastPromise() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useGlobalContext();

  const handleToast = async <T extends AppModelResponse<any>>(
    param1: Promise<T>,
    param2: {
      defaultErrorMessage: LocalizedText;
      loadingMessage: LocalizedText;
    }
  ) => {
    setIsLoading(true);
    return handleToastPromise<T>(param1, {
      loadingMessage: param2?.loadingMessage[currentLanguage],
      defaultErrorMessage: param2?.defaultErrorMessage[currentLanguage],
    }).finally(() => setIsLoading(false));
  };

  return {
    handleToast,
    isLoading,
  };
}
