import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { AppError } from "../types";

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
  errorMessage?: string;
};
export async function handleToastPromise<T>(
  promise: Promise<T & { done: boolean }>,
  {
    loadingMessage,
    errorMessage = "Error: Something went wrong",
  }: IPromiseOptions
): Promise<T> {
  const toastId = toast.loading(loadingMessage);
  return promise
    .then((results) => {
      console.log("handleToastPromise results -->", results);
      if (results.done) {
        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId, {
          render: errorMessage,
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
        render: errorMessage + "(Catch)",
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

interface IMakeTransactionSlug {
  amount: string;
  date: string;
  idFromBank?: string;
}
export const makeTransactionSlug = ({
  amount,
  date,
  idFromBank,
}: IMakeTransactionSlug) => {
  let slug = slugify(amount);
  slug += "@@";
  slug += slugify(date.slice(0, 10));
  slug += "&&";
  slug += idFromBank ? idFromBank : "manual";
  return slug;
};

export const parseAmount = (amount: number) => {
  return Math.round(Math.abs(amount));
};
