import { z } from "zod";
import { timestampSchema } from "..";

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
});

export type TransactionReport = z.infer<typeof transactionReportSchema>;
