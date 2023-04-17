import { z } from "zod";
import { timestampSchema } from "..";
import { TransactionType } from "../Transaction/schema";

export const transactionMinSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: z.enum([TransactionType.credit, TransactionType.debit]),
  creditor: z.string().optional(),
  creditorSlug: z.string().optional(),
});

export const transactionReportSchema = z.object({
  id: z.string(),
  bankAccountId: z.string(),
  amount: z.number(),
  type: z.enum(["day", "month"]),
  date: timestampSchema,
  dateDay: z.string(),
  dateMonth: z.string(),
  dateYear: z.string(),
  dateWeek: z.string(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  transactions: z.array(transactionMinSchema),
});

export type TransactionReport = z.infer<typeof transactionReportSchema>;

export type TransactionMin = z.infer<typeof transactionMinSchema>;
