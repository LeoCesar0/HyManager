import { z } from "zod";
import { timestampSchema } from "..";

export enum TransactionType {
  credit = "credit",
  debit = "debit",
}

export const TransactionTypes = Object.keys(TransactionType);

export const transactionSchema = z.object({
  id: z.string(),
  idFromBank: z.string().optional(),
  bankAccountId: z.string(),
  amount: z.number(),
  type: z.enum([TransactionType.credit, TransactionType.debit]),
  file: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  creditor: z.string().optional(),
  description: z.string().optional(),
  date: timestampSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createTransactionSchema = z.object({
  idFromBank: z.string().optional(),
  bankAccountId: z.string(),
  amount: z.number(),
  type: z.enum([TransactionType.credit, TransactionType.debit]),
  file: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  creditor: z.string().optional(),
  description: z.string().optional(),
  date: timestampSchema,
});

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
