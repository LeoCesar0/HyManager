import currency from "currency.js";
import { TransactionReport } from "../schema";

interface ICalculateAccountBalance {
  newReportsMap: Map<string, TransactionReport>;
  existingReports: TransactionReport[];
}

const calculateAccountBalance = ({
  existingReports,
  newReportsMap,
}: ICalculateAccountBalance) => {
  const allReports: TransactionReport[] = Array.from(newReportsMap.values());
  let result: TransactionReport[] = [];

  for (const existingReport of existingReports) {
    const id = existingReport.id;
    if (!newReportsMap.has(id)) {
      allReports.push(existingReport);
    }
  }

  console.log('allReports -->', allReports)

  const types: TransactionReport["type"][] = ["month", "day"];

  for (const type of types) {
    let filteredByType = allReports.filter((item) => item.type === type);

    console.log('filteredByType 1 -->', filteredByType)

    // SORT
    filteredByType.sort((a, b) => {
      return a.date.seconds - b.date.seconds;
    });

    // SUM ACCOUNT BALANCE
    let accountBalance = currency(0);

    filteredByType = filteredByType.reduce((acc, entry) => {
      accountBalance = accountBalance.add(entry.amount);

      acc.push({
        ...entry,
        accountBalance: accountBalance.value,
      });

      return acc;
    }, [] as typeof filteredByType);

    console.log('filteredByType 2 -->', filteredByType)

    result = result.concat(filteredByType);
  }

  return result;
};

export default calculateAccountBalance;
