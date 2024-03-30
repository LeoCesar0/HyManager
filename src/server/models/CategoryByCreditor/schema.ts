import { z } from "zod";

export const categoryByCreditorSchema = z.object({
    id: z.string().min(1),
    categorySlug: z.string().min(1),
    bankAccountId: z.string().min(1),
    creditorSlug: z.string().min(1),
})

export const createCategoryByCreditorSchema = z.object({
    categorySlug: z.string().min(1),
    bankAccountId: z.string().min(1),
    creditorSlug: z.string().min(1),
})


export type CategoryByCreditor = z.infer<typeof categoryByCreditorSchema>;
export type CreateCategoryByCreditor = z.infer<typeof createCategoryByCreditorSchema>;