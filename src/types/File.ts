import { z } from "zod";

export const fileInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  });

export type FileInfo = z.infer<typeof fileInfoSchema>;
export type FileInfoWithFile = FileInfo & {file: File}