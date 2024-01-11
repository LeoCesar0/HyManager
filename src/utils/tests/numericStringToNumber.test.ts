import { numericStringToNumber } from "../numericStringToNumber";

describe("numericStringToNumber", () => {
  test("it should convert a string with only digits to a number", () => {
    expect(numericStringToNumber("123")).toBe(123);
  });

  test("it should ignore + symbol", () => {
    expect(numericStringToNumber("+123")).toBe(123);
    expect(numericStringToNumber("+ 123.5")).toBe(123.5);
  });

  test("it should treat - symbol as negative", () => {
    expect(numericStringToNumber("-123")).toBe(-123);
    expect(numericStringToNumber("- 123.5")).toBe(-123.5);
  });

  test("it should return zero with empty string", () => {
    expect(numericStringToNumber("")).toBe(0);
  });

  test("it should convert a string with digits and dots to a number", () => {
    expect(numericStringToNumber("123.45")).toBe(123.45);
  });

  test("it should convert a string with digits and commas to a number", () => {
    expect(numericStringToNumber("123,45")).toBe(123.45);
  });

  test("it should convert a string with digits and commas to a number", () => {
    expect(numericStringToNumber("100.123,45")).toBe(100123.45);
  });

  test("it should convert a string with digits and commas to a number", () => {
    expect(numericStringToNumber("100.100.123,45")).toBe(100100123.45);
  });

  test("it should convert 4,5 to 4.5", () => {
    expect(numericStringToNumber("4,5")).toBe(4.5);
  });

  test("it should convert 4.5 to 4.5 as number", () => {
    expect(numericStringToNumber("4,5")).toBe(4.5);
  });

  test("it should convert 4, to 4 as number", () => {
    expect(numericStringToNumber("4,")).toBe(4);
  });

  test("it should convert 4. to 4 as number", () => {
    expect(numericStringToNumber("4.")).toBe(4);
  });

  test("it should return null an error", () => {
    expect(numericStringToNumber("100.100.100,123,45")).toBe(null);
  });

  test("it should return null an error", () => {
    expect(numericStringToNumber("123abc")).toBe(null);
  });

  test("it should return null an error with undefined string", () => {
    expect(numericStringToNumber(undefined!)).toBe(null);
  });
});
