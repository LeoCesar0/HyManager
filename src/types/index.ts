export type AppError = {
  message: string;
} | null;

export type AppModelResponse<T> = {
  error: AppError;
  done: boolean;
  data: T | null;
};
