export const asyncForEach = async <T>(
  arr: T[],
  callback: (arr: T, index: number) => Promise<void>
) => {
    for (let i = 0; i < arr.length; i++) {
      await callback(arr[i], i);
    }
};
