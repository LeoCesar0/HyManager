import { Locale, LocalizedText } from "@/@types";
import { fileInfoSchema } from "@/@types/File";
import { timestampSchema } from "@server/firebase";
import { z } from "zod";

// --------------------------
// CATEGORY
// --------------------------

export const createBankCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const createBankCategorySchemaPT = z.object({
  name: z.string(),
  color: z.string(),
});

export const bankCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  color: z.string(),
  isDefault: z.boolean(),
});

// --------------------------
// BANK ACCOUNT
// --------------------------

export const bankAccountUsersSchema = z.array(z.object({ id: z.string() }));

export const bankAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: bankAccountUsersSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  categories: z.array(bankCategorySchema),
  userLanguage: z.nativeEnum(Locale),
});

export const createBankAccountSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name is required"),
  description: z.string(),
  image: fileInfoSchema.nullable(),
  users: bankAccountUsersSchema,
  categories: z.array(bankCategorySchema),
  userLanguage: z.nativeEnum(Locale),
});

export const createBankAccountSchemaPT: typeof createBankAccountSchema =
  z.object({
    name: z
      .string({ required_error: "Nome é obrigatório" })
      .min(3, "Nome é obrigatório"),
    description: z.string(),
    image: fileInfoSchema.nullable(),
    users: bankAccountUsersSchema,
    categories: z.array(bankCategorySchema),
    userLanguage: z.nativeEnum(Locale),
  });

export const updateBankAccountSchema = bankAccountSchema.partial();

// --------------------------
// TYPES
// --------------------------

export type BankAccount = z.infer<typeof bankAccountSchema>;
export type CreateBankAccount = z.infer<typeof createBankAccountSchema>;
export type UpdateBankAccount = z.infer<typeof updateBankAccountSchema>;

export type BankCategory = z.infer<typeof bankCategorySchema>;
export type CreateBankCategory = z.infer<typeof createBankCategorySchema>;

export type DefaultBankCategory = Omit<BankCategory, "isDefault" | "name"> & {
  isDefault: true;
  name: LocalizedText;
};
