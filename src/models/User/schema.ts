import { z } from "zod";
import { timestampSchema } from "..";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  imageUrl: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
