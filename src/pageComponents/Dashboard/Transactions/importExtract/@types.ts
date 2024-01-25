import { IPDFData } from "@/services/PDFReader/interfaces";

export type GeneralInfo = Omit<IPDFData, "initialBalance" | "finalBalance">;
