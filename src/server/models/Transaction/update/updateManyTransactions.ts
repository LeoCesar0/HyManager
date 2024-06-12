import { writeBatch } from "firebase/firestore";
import { Transaction } from "../schema";
import { firebaseDB } from "@/services/firebase";
import { createDocRef } from "@/server/utils/createDocRef";
import { FirebaseCollection } from "@/server/firebase";
import { AppModelResponse } from "@/@types";

type IProps = {
  transactions: Transaction[];
};

export const updateManyTransactions = async ({
  transactions,
}: IProps): Promise<AppModelResponse<Transaction[]>> => {
  try {
    const batch = writeBatch(firebaseDB);

    transactions.forEach((transaction) => {
      const docRef = createDocRef({
        collection: FirebaseCollection.transactions,
        id: transaction.id,
      });

      transaction.absAmount = Math.abs(transaction.amount);

      if (transaction.id) {
        batch.set(docRef, transaction, { merge: true });
      }
    });

    await batch.commit();

    return {
      data: transactions,
      done: true,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      done: false,
      error: {
        message: "Failed to update transactions",
      },
    };
  }
};
