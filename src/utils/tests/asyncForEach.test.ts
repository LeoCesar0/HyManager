import { asyncForEach } from "../asyncForEach";

describe("asyncForEach Test Suite", () => {
  it("should correctly iterate over an array and await the callback for each item", async () => {
    const arr = [1, 2, 3];
    const callback = jest.fn(async (item: number) => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await asyncForEach(arr, callback);

    expect(callback).toHaveBeenCalledTimes(arr.length);
    arr.forEach((item, index) => {
      expect(callback).toHaveBeenNthCalledWith(index + 1, item, index);
    });
  });

  it("should handle an empty array gracefully", async () => {
    const arr: number[] = [];
    const callback = jest.fn(async (item: number) => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await asyncForEach(arr, callback);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should correctly handle errors thrown by the callback", async () => {
    const arr = [1, 2, 3];
    const callback = jest.fn(async (item: number) => {
      if (item === 2) {
        throw new Error("Error in callback");
      }
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await expect(asyncForEach(arr, callback)).rejects.toThrow(
      "Error in callback"
    );
  });

  it("should return an array with numbers", async () => {
    const arr: number[] = [1, 2];


    await asyncForEach(arr, async (item, index) => {
        await new Promise((resolve) =>
        setTimeout(() => {
            arr[index] = item*2
            resolve(undefined)
        }, 100)
      );
    });

    expect(arr).toStrictEqual([2,4]);
  });
});
