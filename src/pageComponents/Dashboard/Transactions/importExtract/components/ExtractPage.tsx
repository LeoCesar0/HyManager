import { useGlobalContext } from "@/contexts/GlobalContext";
import { IPDFData } from "@/services/PDFReader/interfaces";
import selectT from "@/utils/selectT";
import { formatAnyDate } from "@/utils/date/formatAnyDate";
import { valueToCurrency } from "@/utils/misc";
import { TRANSACTION_TYPE_LABELS } from "@/static/staticLabels";
import { TransactionRow } from "./TransactionRow";
import { TransactionCell } from "./TransactionCell";
import { Title } from "./Title";
import { GeneralInfo } from "../@types";
import { ExtractSummary } from "./ExtractSummary";

type ExtractPageProps = {
  pdfData: IPDFData | GeneralInfo;
  pdfKey: number | string;
};

export const ExtractPage = ({ pdfData, pdfKey }: ExtractPageProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <div className="my-4">
        <ExtractSummary pdfData={pdfData} />
      </div>
      <div>
        <Title>
          {selectT(currentLanguage, {
            en: "Transactions",
            pt: "Transações",
          })}
        </Title>
        <div className="grid grid-cols-1 gap-2 overflow-x-auto">
          {pdfData.transactions.map((transaction, index) => {
            const formattedDate = formatAnyDate(transaction.date);
            const amountFormatted = valueToCurrency(transaction.amount);

            const transactionTypeObjectLanguage =
              TRANSACTION_TYPE_LABELS[transaction.type];

            const transactionTypeLabel = selectT(
              currentLanguage,
              transactionTypeObjectLanguage
            );
            return (
              <TransactionRow key={`trans-${pdfKey}-${index}`}>
                <TransactionCell width={150} transactionType={transaction.type}>
                  {amountFormatted}
                </TransactionCell>
                <TransactionCell width={150} label="Tipo">
                  {transactionTypeLabel}
                </TransactionCell>
                <TransactionCell label="Descrição" width={350}>
                  {transaction.description}
                </TransactionCell>
                <TransactionCell label="Data">{formattedDate}</TransactionCell>
              </TransactionRow>
            );
          })}
        </div>
      </div>
    </>
  );
};
