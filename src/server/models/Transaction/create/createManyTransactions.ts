import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { writeBatch } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from "@server/firebase";
import { CreateTransaction, Transaction } from "../schema";
import { batchManyTransactionReports } from "@models/TransactionReport/create/batchManyTransactionsReport";
import { createDocRef } from "@/server/utils/createDocRef";
import { updateBankAccountBalance } from "../../../utils/updateBankAccountBalance";
import { makeTransactionFields } from "../utils/makeTransactionFields";
import { handleCreditorsOnBatchTransactions } from "../utils/handleCreditorsOnBatchTransactions";

interface ICreateManyTransactions {
  transactions: CreateTransaction[];
  bankAccountId: string;
}

export const createManyTransactions = async ({
  transactions: values,
  bankAccountId,
}: ICreateManyTransactions): Promise<AppModelResponse<{ id: string }[]>> => {
  const funcName = "createManyTransactions";

  try {
    const batch = writeBatch(firebaseDB);
    const transactionsOnCreate: Transaction[] = [];

    values.forEach((transactionInputs) => {
      const transaction = makeTransactionFields({
        transactionInputs: transactionInputs,
        bankAccountId: bankAccountId,
      });

      const docRef = createDocRef({
        collection: FirebaseCollection.transactions,
        id: transaction.id,
      });

      if (!transactionsOnCreate.some((item) => item.id === transaction.id)) {
        transactionsOnCreate.push(transaction);
        batch.set(docRef, transaction, { merge: true });
      }
    });

    /* ------------------------------ COMMIT BATCH ------------------------------ */

    await batchManyTransactionReports({
      bankAccountId,
      batch,
      transactionsOnCreate,
    });

    await handleCreditorsOnBatchTransactions({
      bankAccountId,
      batch,
      transactionsOnCreate,
    })

    await batch.commit();

    const createdTransactionsIds = transactionsOnCreate.map((item) => ({
      id: item.id,
    }));

    await updateBankAccountBalance({
      bankAccountId: bankAccountId,
    });

    return {
      data: createdTransactionsIds,
      done: true,
      error: null,
    };
  } catch (error) {
    const errorMessage = debugDev({
      type: "error",
      name: funcName,
      value: error,
    });
    return {
      data: null,
      done: false,
      error: {
        message: errorMessage,
      },
    };
  }
};
