import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { TransactionReport, transactionReportSchema } from "./schema";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { Transaction } from "../Transaction/schema";
import { makeDateFields } from "src/utils/app";
import { v4 as uuid } from "uuid";
import { timestampToDate } from "src/utils/misc";

interface ICreateTransactionReport {
  transaction: Transaction;
  type: TransactionReport['type']
}

export const createTransactionReport = async ({
  transaction,
  type,
}: ICreateTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "createTransactionReport";

  try {
    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);

    let date = timestampToDate(transaction.date); // if type === day
    let dateTimestamp = transaction.date;

    const newTransactionReport: TransactionReport = {
      id: uuid(),
      amount: transaction.amount,
      bankAccountId: transaction.bankAccountId,
      createdAt: nowTimestamp,
      updatedAt: nowTimestamp,
      date: dateTimestamp,
      type: type,
      ...makeDateFields(date),
    };

    transactionReportSchema.parse(newTransactionReport);

    const result = await firebaseCreate<TransactionReport>({
      collection: FirebaseCollection.transactionReports,
      data: newTransactionReport,
    });
    return result;
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

interface ICreateManyTransactionReports {
  values: TransactionReport[];
}

export const createManyTransactionReports = async ({
  values,
}: ICreateManyTransactionReports): Promise<
  AppModelResponse<{ id: string }[]>
> => {
  const funcName = "createManyTransactionReports";

  try {
    const batch = writeBatch(firebaseDB);
    const createdTransactionReportsIds: { id: string }[] = [];

    values.forEach((transactionReportInputs) => {
      transactionReportSchema.parse(transactionReportInputs);
      const id = transactionReportInputs.id;
      const docRef = doc(firebaseDB, FirebaseCollection.transactionReports, id);
      batch.set(docRef, transactionReportInputs);
      createdTransactionReportsIds.push({ id: id });
    });

    await batch.commit();

    return {
      data: createdTransactionReportsIds,
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
