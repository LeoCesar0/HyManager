import { parseBrazilianDate } from "../date/parseBrazilianDate";

describe('parseBrazilianDate', () => {
 it('should return a valid date for a valid input', () => {
   const result = parseBrazilianDate('30 JUN 2023');
   expect(result).toBeInstanceOf(Date);
 });

 it('should return the correct time zone', () => {
  const result = parseBrazilianDate('30 JUN 2023') as Date

  expect(result.getTimezoneOffset()).toBe(180);
  expect(result.getUTCDate()).toBe(30);
  expect(result.getUTCMonth()).toBe(5);
  expect(result.getUTCFullYear()).toBe(2023);
  expect(result.getUTCHours()).toBe(3);
});

 it('should return false for an invalid input', () => {
   const result = parseBrazilianDate('invalid date');
   expect(result).toBe(false);
 });

 it('should return false for an input with incorrect format', () => {
   const result = parseBrazilianDate('30-JUN-2023');
   expect(result).toBe(false);
 });
});