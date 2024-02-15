import { AppModelResponse } from "@/@types";
import { listTransactionReportsBy } from "../models/TransactionReport/read/listTransactionReportBy";
import { updateBankAccount } from "../models/BankAccount/update/updateBankAccount";

type IUpdateBankAccountBalance = {
  bankAccountId: string;
};

export const updateBankAccountBalance = async ({
  bankAccountId,
}: IUpdateBankAccountBalance): Promise<AppModelResponse<number | null>> => {
  const response = await listTransactionReportsBy({
    bankAccountId: bankAccountId,
    type: "month",
  });


  if (!response.data) {
    return {
      data: null,
      done: false,
      error: {
        message: "Error loading reports",
      },
    };
  }

  const transactionsReport = response.data || [];

  const balance = transactionsReport.reduce(
    (acc, report) => acc + report.amount,
    0
  );

  const updateResponse = await updateBankAccount({
    id: bankAccountId,
    values: {
      balance: balance,
    },
  });


  if (!updateResponse.done) {
    return {
      data: null,
      done: false,
      error: {
        message: "Error updating bank account",
      },
    };
  }

  return {
    data: balance,
    done: true,
    error: null,
  };
};
