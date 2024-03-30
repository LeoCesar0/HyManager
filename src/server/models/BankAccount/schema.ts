import { LocalizedText } from "@/@types";
import { fileInfoSchema } from "@/@types/File";
import { timestampSchema } from "@server/firebase";
import { z } from "zod";

export const bankCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  color: z.string(),
  isDefault: z.boolean()
});


export const bankAccountUsersSchema = z.array(z.object({ id: z.string() }))

export const bankAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: bankAccountUsersSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  balance: z.number(),
  categories: z.array(bankCategorySchema),
});

export const createBankAccountSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name is required"),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: bankAccountUsersSchema,
  categories: z.array(bankCategorySchema),
});

export const createBankAccountSchemaPT: typeof createBankAccountSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(3, "Nome é obrigatório"),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: bankAccountUsersSchema,
  categories: z.array(bankCategorySchema),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;

export type CreateBankAccount = z.infer<typeof createBankAccountSchema>;

export type BankCategory = z.infer<typeof bankCategorySchema>

export type DefaultBankCategory = Omit<BankCategory, 'isDefault' | 'name'> & {
  isDefault: true,
  name: LocalizedText
}