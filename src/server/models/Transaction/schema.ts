import { fileInfoSchema } from "@/@types/File";
import { timestampSchema } from "@/server/firebase";
import { z } from "zod";

export enum TransactionType {
  deposit = "deposit",
  debit = "debit",
}

export const TransactionTypes = Object.keys(TransactionType);

export const transactionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  idFromBank: z.string().optional(),
  bankAccountId: z.string(),
  amount: z.number(),
  updatedBalance: z.number(),
  type: z.enum([TransactionType.deposit, TransactionType.debit]),
  file: fileInfoSchema.optional(),
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
  type: z.enum([TransactionType.deposit, TransactionType.debit]),
  file: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  creditor: z.string().min(1),
  description: z.string(),
  date: z.date({
    invalid_type_error: "Insert a date",
    required_error: "This field is required!",
  }),
  amount: z.number(),
  updatedBalance: z.number(),
});

export const createTransactionSchemaPT: typeof createTransactionSchema =
  z.object({
    slug: z.string().optional(),
    idFromBank: z.string().optional(),
    bankAccountId: z.string().optional(),
    type: z.enum([TransactionType.deposit, TransactionType.debit]),
    file: z
      .object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
      .optional(),
    creditor: z.string().min(1),
    description: z.string(),
    date: z.date({
      invalid_type_error: "Insira uma data",
      required_error: "Campo obrigatório",
    }),
    amount: z.number(),
    updatedBalance: z.number(),
  });

export const createTransactionFromPDFSchema = z.object({
  slug: z.string().optional(),
  idFromBank: z.string().optional(),
  bankAccountId: z.string().optional(),
  type: z.enum([TransactionType.deposit, TransactionType.debit]),
  file: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  creditor: z.string(),
  description: z.string(),
  date: z.date().or(z.string()),
  amount: z.number(),
  updatedBalance: z.number(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export type CreateTransaction = z.infer<typeof createTransactionSchema>;

export type CreateTransactionFromPDF = z.infer<
  typeof createTransactionFromPDFSchema
>;
