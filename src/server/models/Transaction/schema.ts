import { timestampSchema } from "src/server/firebase";
import { z } from "zod";

export enum TransactionType {
  credit = "credit",
  debit = "debit",
}

export const TransactionTypes = Object.keys(TransactionType);

export const transactionSchema = z.object({
  id: z.string(),
  slug: z.string(),
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
  creditorSlug: z.string().optional(),
  description: z.string().optional(),
  date: timestampSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  color: z.string().optional(),
  dateDay: z.string(),
  dateMonth: z.string(),
  dateYear: z.string(),
  dateWeek: z.string(),
});

export const createTransactionSchema = z.object({
  slug: z.string().optional(),
  idFromBank: z.string().optional(),
  bankAccountId: z.string().optional(),
  type: z.enum([TransactionType.credit, TransactionType.debit]),
  file: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  creditor: z.string().optional(),
  description: z
    .string({ required_error: "Insert a description" })
    .min(2, "Min 2 character"),
  date: z.string({
    invalid_type_error: "Insert a date",
    required_error: "This field is required!",
  }),
  amount: z.number({
    invalid_type_error: "Insert a number",
    required_error: "This field is required!",
  }),
  color: z.string().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
