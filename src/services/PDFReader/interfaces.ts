import { createTransactionFromPDFSchema } from "@/server/models/Transaction/schema";
import { date, z } from "zod";
import { IPDFRawData } from "./rawDataTypes";

export const PDFDataSchema = z.object({
  initialBalance: z.number(),
  income: z.number(),
  totalCredit: z.number(),
  totalDebit: z.number(),
  finalBalance: z.number(),
  transactions: z.array(createTransactionFromPDFSchema),
  slug: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  fileId: z.string(),
});

export type IPDFData = z.infer<typeof PDFDataSchema>;

export interface IPDFDataParser {
  parse(
    data: IPDFRawData[],
    bankAccountId: string,
    fileIds: string[]
  ): IPDFData[];
}
