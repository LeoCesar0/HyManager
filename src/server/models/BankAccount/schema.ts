import { fileInfoSchema } from "@/@types/File";
import { timestampSchema } from "@server/firebase";
import { z } from "zod";

export const bankAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: z.array(z.object({ id: z.string() })),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createBankAccountSchema = z.object({
  name: z.string({required_error: 'Name is required'}).min(3, 'Name is required'),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: z.array(z.object({ id: z.string() })),
});

export const createBankAccountSchemaPT = z.object({
  name: z.string({required_error: 'Nome é obrigatório'}).min(3, 'Nome é obrigatório'),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: z.array(z.object({ id: z.string() })),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;
export type CreateBankAccount = z.infer<typeof createBankAccountSchema>;

