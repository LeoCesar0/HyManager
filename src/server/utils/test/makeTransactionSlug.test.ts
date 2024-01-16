import { makeTransactionSlug } from "../makeTransactionSlug";

describe('Test makeTransactionSlug', () => {
 it('should handle all parameters - 1', () => {
   const result = makeTransactionSlug({
     amount: 100,
     date: new Date(2021,8,1),
     idFromBank: '123456',
     creditor: 'John Doe',
   });
   expect(result).toBe('$$100TT2021-09-01@@john-doe##123456');
 });

 it('should handle float amount', () => {
    const result = makeTransactionSlug({
      amount: 100.5,
      date: new Date(2021,8,1),
      idFromBank: '123456',
      creditor: 'John Doe',
    });
    expect(result).toBe('$$100.5TT2021-09-01@@john-doe##123456');
  });

  it('should handle negative amount', () => {
    const result = makeTransactionSlug({
      amount: -56,
      date: new Date(2021,8,1),
      idFromBank: '123456',
      creditor: 'John Doe',
    });
    expect(result).toBe('$$-56TT2021-09-01@@john-doe##123456');
  });

  it('should handle negative and float amount', () => {
    const result = makeTransactionSlug({
      amount: -10.5,
      date: new Date(2021,8,1),
      idFromBank: '123456',
      creditor: 'John Doe',
    });
    expect(result).toBe('$$-10.5TT2021-09-01@@john-doe##123456');
  });

 it('should handle missing idFromBank', () => {
   const result = makeTransactionSlug({
     amount: 100,
     date: new Date(2021,8,1),
     creditor: 'John Doe',
   });
   expect(result).toMatch(/^(\$\$\d+TT.*@@.*##manual)$/);
 });

 it('should handle date as string', () => {
   const result = makeTransactionSlug({
     amount: 100,
     date: '2022-01-25',
     idFromBank: '123456',
     creditor: 'John Doe',
   });
   expect(result).toBe('$$100TT2022-01-25@@john-doe##123456');
 });

 it('should handle date as string full iso', () => {
    const result = makeTransactionSlug({
      amount: 100,
      date: '2022-01-25T03:00:00.000Z',
      idFromBank: '123456',
      creditor: 'John Doe',
    });
    expect(result).toBe('$$100TT2022-01-25@@john-doe##123456');
  });

 it('should handle missing creditor', () => {
    // @ts-expect-error
   const result = makeTransactionSlug({
     amount: 100,
     date: new Date(2021,8,1),
     idFromBank: '123456',
   });
    expect(result).toBe('$$100TT2021-09-01##123456');
 });
});