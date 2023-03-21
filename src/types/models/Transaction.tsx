import { z } from "zod";
import {
  CreateTransactionMutationVariables,
  GetTransactionsByBankQuery,
  TransactionType,
} from "../../graphql/generated";

export type Transaction = GetTransactionsByBankQuery["transactions"][number];

export const transactionSchema = z.object({
  idFromBankTransaction: z.string().optional(),
  bankAccountId: z.string(),
  amount: z.number(),
  type: z.enum([TransactionType.Credit, TransactionType.Debit]),
  date: z.date(),
  creditor: z.string().optional(),
  description: z.string().optional(),
  slug: z.string(),
});

export const createTransactionSchema = z.object({
  idFromBankTransaction: z
    .string({ invalid_type_error: "IdFromBankTransaction error" })
    .optional(),
  bankAccountId: z.string({ invalid_type_error: "BankAccountId error" }),
  amount: z.number({ invalid_type_error: "Amount error" }),
  type: z.enum([TransactionType.Credit, TransactionType.Debit], {
    invalid_type_error: "Type Error",
  }),
  date: z.date({ invalid_type_error: "Date error" }),
  creditor: z.string({ invalid_type_error: "Creditor error" }).optional(),
  description: z.string({ invalid_type_error: "Description error" }).optional(),
  slug: z.string({ invalid_type_error: "Slug error" }),
});

export type CreateTransaction = z.infer<typeof createTransactionSchema> & {
  color: CreateTransactionMutationVariables["color"];
};
