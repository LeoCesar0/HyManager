import { WhereFilterOp } from "firebase/firestore";

export type AppError = {
  message: string;
} | null;

export type AppModelResponse<T> = {
  error: AppError;
  done: boolean;
  data: T | null;
};

export type AppBaseDocFields<T> = T & {
  createdAtDay: string;
  createdAtMonth: string;
  createdAtYear: string;
  createdAtWeek: string;
};

export type CSVData = string[][];

export enum Locale {
  en = "en",
  pt = "pt",
}

export type AnyObject = {
  [key: string | number | symbol]: any;
};

export type FirebaseFilterFor<T> = {
  field: keyof T;
  operator: WhereFilterOp;
  value: any;
};
