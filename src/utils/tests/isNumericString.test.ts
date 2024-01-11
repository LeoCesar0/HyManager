import { isNumericString } from "../isNumericString";

describe("isNumericString", () => {
  it("should return true for valid numeric strings", () => {
    expect(isNumericString("123")).toBe(true);
    expect(isNumericString("123.456")).toBe(true);
    expect(isNumericString("-123")).toBe(true);
    expect(isNumericString("-123.456")).toBe(true);
    expect(isNumericString("1,234.56")).toBe(true);
    expect(isNumericString("-1,234.56")).toBe(true);
    expect(isNumericString("-123.456.789")).toBe(true);
    expect(isNumericString("-123,456,789")).toBe(true);
  });

  it("should return false for invalid numeric strings", () => {
    expect(isNumericString("123abc")).toBe(false);
    expect(isNumericString("123.456.789,000,00")).toBe(false);
    expect(isNumericString("123,456,789.500.50")).toBe(false);
    expect(isNumericString("-123abc")).toBe(false);
  });

  it("should return false for non-string inputs", () => {
    //@ts-expect-error
    expect(isNumericString(null)).toBe(false);
    //@ts-expect-error
    expect(isNumericString(undefined)).toBe(false);
    //@ts-expect-error
    expect(isNumericString(123)).toBe(false);
    //@ts-expect-error
    expect(isNumericString({})).toBe(false);
    //@ts-expect-error
    expect(isNumericString([])).toBe(false);
  });
});
