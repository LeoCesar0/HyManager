import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { writeBatch } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from "@server/firebase";
import { CreateTransaction, Transaction } from "../schema";
import { batchManyTransactionReports } from "@models/TransactionReport/create/batchManyTransactionsReport";
import { createDocRef } from "@/server/utils/createDocRef";
import { makeTransactionFields } from "../utils/makeTransactionFields";
import { handleCreditorsOnBatchTransactions } from "../utils/handleCreditorsOnBatchTransactions";
import { ALGOLIA_CLIENT, ALGOLIA_INDEXES } from "@/services/algolia";

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
    const transactionsOnCreateIds = new Set<string>();

    values.forEach((transactionInputs) => {
      const transaction = makeTransactionFields({
        transactionInputs: transactionInputs,
        bankAccountId: bankAccountId,
      });

      const docRef = createDocRef({
        collection: FirebaseCollection.transactions,
        id: transaction.id,
      });

      if (!transactionsOnCreateIds.has(transaction.id)) {
        transactionsOnCreateIds.add(transaction.id);
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

    const createdCreditors = await handleCreditorsOnBatchTransactions({
      bankAccountId,
      batch,
      transactionsOnCreate,
    });

    await batch.commit();

    const createdTransactionsIds = transactionsOnCreate.map((item) => ({
      id: item.id,
    }));

    // --------------------------
    // INDEX CREDITORS
    // --------------------------

    if (createdCreditors.length >= 0) {
      const objects = createdCreditors.map((item) => ({
        ...item,
        objectID: item.id,
      }));
      const algoliaIndex = ALGOLIA_CLIENT.initIndex(ALGOLIA_INDEXES.CREDITORS);
      algoliaIndex.saveObjects(objects).catch((error) => {
        console.error("Error indexing creditors", error);
      });
    }

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
