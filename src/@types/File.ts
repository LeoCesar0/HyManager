import { z } from "zod";

export const fileInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  });

export type FileInfo = z.infer<typeof fileInfoSchema>;

export type FileInfoWithFile = FileInfo & {file: File}

export type FileWithId = File & {id: string}

export type TempImage = {
  file: File | null;
  url: string;
} 