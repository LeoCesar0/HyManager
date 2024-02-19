import {
  Transaction,
  transactionSchema,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { getRangedRandom } from "@/utils/getRangedRandom";
import { generateMock } from "@anatine/zod-mock";
import { Timestamp } from "firebase/firestore";
import { makeDateFields } from "../../../../utils/date/makeDateFields";

export const mockTransactions = ({
  count,
  dateRange,
}: {
  count: number;
  dateRange?: [Date, Date];
}) => {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    let mockedTrans = generateMock(transactionSchema);

    const randomAmount = Math.floor(Math.random() * 2001) - 1000;

    if (randomAmount > 0) {
      mockedTrans.type = TransactionType.deposit;
    } else {
      mockedTrans.type = TransactionType.debit;
    }

    if (dateRange) {
      const unixStart = dateRange[0].getTime();
      const unixEnd = dateRange[1].getTime();
      const randomUnix = getRangedRandom(unixStart, unixEnd);

      const mockedDate = new Date(randomUnix);
      const mockedTimestamp = Timestamp.fromDate(mockedDate);

      const now = new Date();
      const nowTimestamp = Timestamp.fromDate(now);

      mockedTrans.createdAt = nowTimestamp;
      mockedTrans.updatedAt = nowTimestamp;

      mockedTrans.date = mockedTimestamp;
      mockedTrans = {
        ...mockedTrans,
        ...makeDateFields(mockedDate),
      };
    }

    transactions.push(mockedTrans);
  }

  return transactions;
};
