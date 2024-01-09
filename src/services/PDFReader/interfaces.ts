import {
  createTransactionSchema,
  transactionSchema,
} from "src/server/models/Transaction/schema";
import { z } from "zod";
import { IPDFRawData } from "./rawDataTypes";

export const PDFDataSchema = z.object({
  initialBalance: z.number(),
  income: z.number(),
  totalCredit: z.number(),
  totalDebit: z.number(),
  finalBalance: z.number(),
  transactions: z.array(createTransactionSchema),
});

export type IPDFData = z.infer<typeof PDFDataSchema>;

export interface IPDFDataParser {
  parse(data: IPDFRawData[], bankAccountId: string): IPDFData[];
}

