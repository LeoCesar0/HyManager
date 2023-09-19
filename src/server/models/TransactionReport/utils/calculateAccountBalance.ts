import currency from "currency.js";
import { TransactionReport } from "../schema";

interface ICalculateAccountBalance {
  newReportsMap: Map<string, TransactionReport>;
  existingReports: TransactionReport[];
}

const calculateAccountBalance = ({
  existingReports,
  newReportsMap,
}: ICalculateAccountBalance): TransactionReport[] => {
  const allReports: TransactionReport[] = Array.from(newReportsMap.values());
  let calculatedReports: TransactionReport[] = [];

  for (const existingReport of existingReports) {
    if (!newReportsMap.has(existingReport.id)) {
      allReports.push(existingReport);
    }
  }

  console.log("allReports -->", allReports);

  const types: TransactionReport["type"][] = ["month", "day"];

  for (const type of types) {
    let filteredByType = allReports.filter((item) => item.type === type);

    // SORT
    filteredByType.sort((a, b) => {
      return a.date.seconds - b.date.seconds;
    });

    // SUM ACCOUNT BALANCE
    let initialBalance = currency(filteredByType[0].initialBalance);
    let finalBalance = currency(0);

    filteredByType = filteredByType.reduce((acc, entry) => {
      finalBalance = initialBalance.add(entry.amount);

      acc.push({
        ...entry,
        initialBalance: initialBalance.value,
        finalBalance: finalBalance.value,
      });

      // Next entry
      initialBalance = currency(finalBalance.value);

      return acc;
    }, [] as typeof filteredByType);

    calculatedReports = calculatedReports.concat(filteredByType);
  }

  return calculatedReports;
};

export default calculateAccountBalance;
