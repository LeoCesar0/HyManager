import cloneDeep from "lodash.clonedeep";

export const replaceItemOfArray = <T>({
  array,
  item,
  key,
}: {
  array: any[];
  item: any;
  key: keyof T;
}) => {
  const clone = cloneDeep(array);
  const index = clone.findIndex((i) => i[key] === item[key]);
  if (index === -1) return clone;

  clone.splice(index, 1, item);
  return clone;
};
