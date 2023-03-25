import { z } from "zod";
import { timestampSchema } from "..";

export const bankAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  balance: z.string(),
  users: z.array(z.object({ id: z.string() })),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createBankAccountSchema = z.object({
  name: z.string(),
  imageUrl: z.string().nullable(),
  balance: z.string(),
  users: z.array(z.object({ id: z.string() })),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;
export type CreateBankAccount = z.infer<typeof createBankAccountSchema>;

