import { Transaction, TransactionType } from "../schema";
import { createTransaction } from "../create/createTransaction";
import { TEST_CONFIG } from "@/static/testConfig";
import { getTransactionById } from "../read/getTransactionById";
import { timestampToDate } from "@/utils/date/timestampToDate";
import { formatAnyDate } from "../../../../utils/date/formatAnyDate";
import { firebaseAuth } from "@/services/firebase";
import { listTransactionReportsBy } from "../../TransactionReport/read/listTransactionReportBy";
import { listTransactionReportByTransaction } from "../../TransactionReport/read/listTransactionReportByTransaction";

describe("Test transaction CRUD", () => {
  let createdTransaction: Transaction;
  const bankAccountId = TEST_CONFIG.bankAccountId;

  // --------------------------
  // CREATE
  // --------------------------

  it("should create a transaction", async () => {
    console.log("--> START TEST 1");

    const result = await createTransaction({
      bankAccountId,
      values: {
        amount: -100.5,
        date: new Date(2020, 0, 25),
        creditor: "test",
        idFromBank: "test",
        type: TransactionType.debit,
        description: "test",
        bankAccountId,
      },
    });
    if (result.error) console.log("Error", result.error);
    expect(result.data).toBeTruthy();
    expect(result.data?.id).toBeTruthy();
    expect(result.done).toBe(true);
    expect(result.error).toBe(null);
    if (result.data) createdTransaction = result.data;
  });

  // --------------------------
  // GET TRANSACTION AND ITS REPORT
  // --------------------------

  it("should get created transaction", async () => {
    const result = await getTransactionById({
      id: createdTransaction.id,
    });
    expect(result.data?.id).toBeTruthy();
    expect(result.done).toBe(true);
    expect(result.error).toBe(null);
    if (result.data) {
      expect(result.data.id).toBe(createdTransaction.id);
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
