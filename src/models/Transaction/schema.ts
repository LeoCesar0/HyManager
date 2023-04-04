import { z } from "zod";
import { timestampSchema } from "..";

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
  description: z.string().optional(),
  date: timestampSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  color: z.string().optional(),
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
    .min(4, "Min 4 characters"),
  date: z.string({
    invalid_type_error: "Insert a date",
    required_error: "This field is required!",
  }),
  amount: z
    .number({
      invalid_type_error: "Insert a number",
      required_error: "This field is required!",
    })
    .positive("Insert a number above zero"),
  color: z.string().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;


