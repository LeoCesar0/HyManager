import { AppError } from "@/@types";
import { ZodError } from "zod";

export const zodErrorToAppError = (zodError: ZodError): AppError => {
  const error: AppError = {
    message: "Error!",
  };

  const message = zodError.issues
    .map((err) => {
      return err.message;
    })
    .join("\n");

  error.message = message;

  return error;
};
