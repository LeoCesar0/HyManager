import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { TransactionReport, transactionReportSchema } from "./schema";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { Transaction } from "../Transaction/schema";
import { makeDateFields } from "src/utils/app";
import { timestampToDate } from "src/utils/misc";

interface ICreateTransactionReport {
  transaction: Transaction;
  type: TransactionReport["type"];
}

const makeTransactionReportSlugId = ({
  date,
  backAccountId,
  type,
}: {
  backAccountId: string;
  date: Date;
  type: TransactionReport["type"];
}) => {
  const dateParams = makeDateFields(date);
  let string = `${dateParams.dateYear}-${dateParams.dateMonth}`;
  if (type === "day") string += `-${dateParams.dateDay}`;
  string += `-${backAccountId}`;
  return string;
};

export const makeTransactionReportFields = (
  transaction: Transaction,
  type: TransactionReport["type"]
): TransactionReport => {
  const now = new Date();
  const nowTimestamp = Timestamp.fromDate(now);

  let date = timestampToDate(transaction.date); // if type === day
  let dateTimestamp = transaction.date;

  const newTransactionReport: TransactionReport = {
    id: makeTransactionReportSlugId({
      backAccountId: transaction.bankAccountId,
      date: date,
      type,
    }),
    amount: transaction.amount,
    bankAccountId: transaction.bankAccountId,
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
    date: dateTimestamp,
    type: type,
    ...makeDateFields(date),
  };
  return newTransactionReport;
};

export const createTransactionReport = async ({
  transaction,
  type,
}: ICreateTransactionReport): Promise<AppModelResponse<TransactionReport>> => {
  const funcName = "createTransactionReport";

  try {
    const newTransactionReport = makeTransactionReportFields(transaction, type);

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
      transactionReportInputs.id = makeTransactionReportSlugId({
        backAccountId: transactionReportInputs.bankAccountId,
        date: timestampToDate(transactionReportInputs.date),
        type: "month",
      });
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
