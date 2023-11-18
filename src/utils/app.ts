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
  defaultErrorMessage: string;
};

export async function handleToastPromise<T>(
  promise: Promise<T & AppModelResponse<any>>,
  { loadingMessage, defaultErrorMessage }: IPromiseOptions
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

export const makeCreatedAtFields = (
  date: Date
): {
  createdAtDay: string;
  createdAtMonth: string;
  createdAtYear: string;
  createdAtWeek: string;
} => {
  const day = format(date, "dd");
  const month = format(date, "MM");
  const year = format(date, "yyyy");
  const week = format(date, "Q");
  return {
    createdAtDay: day,
    createdAtMonth: month,
    createdAtYear: year,
    createdAtWeek: week,
  };
};
export const makeDateFields = (
  date: Date
): {
  dateDay: string;
  dateMonth: string;
  dateYear: string;
  dateWeek: string;
} => {
  const day = format(date, "dd");
  const month = format(date, "MM");
  const year = format(date, "yyyy");
  const week = format(date, "Q");
  return {
    dateDay: day,
    dateMonth: month,
    dateYear: year,
    dateWeek: week,
  };
};
