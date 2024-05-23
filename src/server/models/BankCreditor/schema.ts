import { z } from "zod";

export const bankCreditorSchema = z.object({
  id: z.string().min(1),
  categories: z.array(z.string()),
  bankAccountId: z.string().min(1),
  creditorSlug: z.string().min(1),
  creditor: z.string().min(1),
});

export const createBankCreditorSchema = z.object({
  categories: z.array(z.string()),
  bankAccountId: z.string().min(1),
  creditorSlug: z.string().min(1),
  creditor: z.string().min(1),
});

export type BankCreditor = z.infer<typeof bankCreditorSchema>;
export type CreateBankCreditor = z.infer<typeof createBankCreditorSchema>;
