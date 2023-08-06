import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { CreateTransaction, Transaction, transactionSchema } from "../schema";
import {
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { makeDateFields, slugify } from "src/utils/app";
import { firebaseDB } from "src/services/firebase";
import { FirebaseCollection } from "@server/firebase";
import { makeTransactionSlug } from "@server/utils/makeTransactionSlug";
import { batchManyTransactionReports } from "@models/TransactionReport/create/batchManyTransactionsReport";

interface ICreateTransaction {
    values: CreateTransaction;
    bankAccountId: string;
  }
  
  export const createTransaction = async ({
    values,
    bankAccountId,
  }: ICreateTransaction): Promise<AppModelResponse<Transaction>> => {
    const funcName = "createTransaction";
    const date = new Date(values.date);
    const firebaseTimestamp = Timestamp.fromDate(date);
    const now = new Date();
    const slugId = makeTransactionSlug({
      date: values.date,
      amount: values.amount.toString(),
      idFromBank: values.idFromBank,
      creditor: values.creditor || "",
    });
    const transaction: Transaction = {
      ...values,
      bankAccountId: bankAccountId,
      id: slugId,
      slug: slugId,
      date: firebaseTimestamp,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      ...makeDateFields(date),
    };
    if (transaction.creditor)
      transaction.creditorSlug = slugify(transaction.creditor);
    try {
      transactionSchema.parse(transaction);
  
      const batch = writeBatch(firebaseDB);
      const transactionsRef = doc(
        firebaseDB,
        FirebaseCollection.transactionReports,
        transaction.id
      );
  
      batch.set(transactionsRef, transaction);
  
      await batchManyTransactionReports({
        bankAccountId: bankAccountId,
        batch: batch,
        transactionsOnCreate: [transaction],
      });
  
      await batch.commit();
  
      return {
        done: true,
        error: null,
        data: transaction,
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