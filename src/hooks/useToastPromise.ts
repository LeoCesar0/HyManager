import { useGlobalContext } from "../contexts/GlobalContext";
import { LocalizedText, AppModelResponse } from "../@types/index";
import { useState } from "react";
import { ToastPromiseLoadingMessages, handleToastPromise } from "@utils/app";

type ToastMessages = {
  defaultErrorMessage: LocalizedText;
  loadingMessage: LocalizedText;
  successMessage: LocalizedText;
};

const defaultMessages = {
  updateMessages: {
    defaultErrorMessage: {
      pt: "Erro ao salvar",
      en: "Error on updating",
    },
    loadingMessage: {
      pt: "Atualizando",
      en: "Updating",
    },
    successMessage: {
      pt: "Salvo com Sucesso!",
      en: "Saved Successfully",
    },
  },
} as const;

export function useToastPromise() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useGlobalContext();

  const handleToast = async <T extends AppModelResponse<any>>(
    param1: Promise<T>,
    param2: ToastMessages | keyof typeof defaultMessages
  ) => {
    setIsLoading(true);
    let toastMessages: ToastPromiseLoadingMessages;

    if (typeof param2 === "string") {
      const messages = defaultMessages[param2];
      toastMessages = {
        loadingMessage: messages.loadingMessage[currentLanguage],
        defaultErrorMessage: messages.defaultErrorMessage[currentLanguage],
        successMessage: messages.successMessage[currentLanguage],
      };
    } else {
      toastMessages = {
        loadingMessage: param2.loadingMessage[currentLanguage],
        defaultErrorMessage: param2.defaultErrorMessage[currentLanguage],
        successMessage: param2.successMessage[currentLanguage],
      };
    }

    return handleToastPromise<T>(param1, toastMessages).finally(() =>
      setIsLoading(false)
    );
  };

  return {
    handleToast,
    isLoading,
  };
}
