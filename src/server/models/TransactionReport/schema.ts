import { timestampSchema } from "@server/firebase";
import { z } from "zod";
import { TransactionType } from "../Transaction/schema";

export const transactionMinSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: z.enum([TransactionType.deposit, TransactionType.debit]),
  creditor: z.string().optional(),
  creditorSlug: z.string().optional(),
});

export const transactionsSummarySchema = z.object({
  biggestDebit: transactionMinSchema,
  biggestDeposit:  transactionMinSchema,
  totalExpenses: z.number(),
  totalDeposits: z.number(),
})

export const transactionReportSchema = z.object({
  id: z.string(),
  bankAccountId: z.string(),
  amount: z.number(),
  initialBalance: z.number(),
  finalBalance: z.number(),
  type: z.enum(["day", "month"]),
  date: timestampSchema,
  dateDay: z.string(),
  dateMonth: z.string(),
  dateYear: z.string(),
  dateWeek: z.string(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  transactions: z.array(transactionMinSchema),
  summary: transactionsSummarySchema
});

export type TransactionReport = z.infer<typeof transactionReportSchema>;

export type TransactionMin = z.infer<typeof transactionMinSchema>;

export type TransactionsSummary = z.infer<typeof transactionsSummarySchema>;