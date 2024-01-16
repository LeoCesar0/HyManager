import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { TransactionReport, transactionReportSchema } from "../schema";
import { doc, writeBatch } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { makeTransactionReportSlugId } from "../utils/makeTransactionReportSlugId";
import { FirebaseCollection } from "@server/firebase";
import { timestampToDate } from "@/utils/date/timestampToDate";

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
