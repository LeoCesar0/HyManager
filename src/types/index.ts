export type AppError = {
  message: string;
} | null;

export type AppModelResponse<T> = {
  error: AppError;
  done: boolean;
  data: T | null;
};

export type CSVData = string[][]

export enum Locale {
  en = 'en',
  pt = 'pt'
}
