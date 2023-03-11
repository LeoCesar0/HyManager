import { toast } from "react-toastify";
import { AppError } from "../types";

export const ShowErrorToast = (error: AppError) => {
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
    if (error) console.log("ShowErrorToast -->", error);
  }
};

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
