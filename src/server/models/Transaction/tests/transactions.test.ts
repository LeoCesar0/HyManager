import {
  CreateTransactionFromPDF,
  Transaction,
  TransactionType,
} from "../schema";
import { TEST_CONFIG } from "@/static/testConfig";
import { getTransactionById } from "../read/getTransactionById";
import { timestampToDate } from "@/utils/date/timestampToDate";
import { formatAnyDate } from "../../../../utils/date/formatAnyDate";
import { listTransactionReportByTransaction } from "../../TransactionReport/read/listTransactionReportByTransaction";
import { createManyTransactions } from "../create/createManyTransactions";

describe("Test transaction CRUD", () => {
  let createdTransaction: Transaction;
  let createdTransactionId: string = "null";
  const bankAccountId = TEST_CONFIG.bankAccountId;

  // --------------------------
  // CREATE
  // --------------------------

  it("should create a transaction", async () => {
    const values: CreateTransactionFromPDF = {
      amount: -100.5,
      date: new Date(2020, 0, 25),
      creditor: "test",
      creditorInfo: "creditorInfo",
      idFromBank: "test",
      type: TransactionType.debit,
      description: "test",
      bankAccountId,
      updatedBalance: -100.5,
      categories: [],
    };

    const result = await createManyTransactions({
      bankAccountId,
      transactions: [values],
    });
    if (result.error) console.log("Error", result.error);
    const transactionId = result.data?.[0]?.id;
    expect(result.data).toBeTruthy();
    expect(transactionId).toBeTruthy();
    expect(result.done).toBe(true);
    expect(result.error).toBe(null);

    if (transactionId) createdTransactionId = transactionId;
  });

  // --------------------------
  // GET TRANSACTION AND ITS REPORT
  // --------------------------

  it("should get created transaction", async () => {
    const result = await getTransactionById({
      id: createdTransactionId,
    });
    expect(result.data?.id).toBeTruthy();
    expect(result.done).toBe(true);
    expect(result.error).toBe(null);
    if (result.data) {
      createdTransaction = result.data;
      expect(result.data.id).toBe(createdTransactionId);
      expect(result.data.amount).toBe(-100.5);
      const date = timestampToDate(result.data.date);
      const formattedDate = formatAnyDate(date, "dd/MM/yyyy");
      expect(formattedDate).toBe("25/01/2020");
      expect(date.getFullYear()).toBe(2020);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(25);
    }
  });

  it("should get created transaction report", async () => {
    const result = await listTransactionReportByTransaction({
      transaction: createdTransaction,
    });
    expect(result.data?.length).toBe(2);
    expect(result.done).toBe(true);
    expect(result.error).toBe(null);
  });
});
