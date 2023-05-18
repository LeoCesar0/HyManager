import { makeDateFields } from "src/utils/app";
import { TransactionReport } from "../schema";

export const makeTransactionReportSlugId = ({
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
  string += `##${backAccountId}`;
  return string;
};
