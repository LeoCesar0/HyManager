import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { AppError, AppModelResponse } from "../@types";
import { useGlobalContext } from "../contexts/GlobalContext";

export const showErrorToast = (error: AppError) => {
  const message = error?.message;
  if (message) {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } else {
    if (error) console.log("showErrorToast -->", error);
  }
};

type IPromiseOptions = {
  loadingMessage: string;
  successMessage: string;
  defaultErrorMessage: string;
};

export async function handleToastPromise<T extends AppModelResponse<any>>(
  promise: Promise<T>,
  { loadingMessage, defaultErrorMessage, successMessage }: IPromiseOptions
): Promise<T> {
  const toastId = toast.loading(loadingMessage);

  return promise
    .then((results) => {
      if (results.done) {
        toast.update(toastId, {
          render: successMessage || 'Success',
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId, {
          render: results?.error?.message || defaultErrorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      return promise;
    })
    .catch((error) => {
      console.log("handleToastPromise error -->", error);
      toast.update(toastId, {
        render: defaultErrorMessage + "(Catch)",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return promise;
    });
}

export const slugify = (string: string) => {
  if (!string) return "";
  const newText = string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return newText;
};



