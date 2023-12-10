export type ITableColumn<T> = {
  label: string;
  key: keyof T;
};
