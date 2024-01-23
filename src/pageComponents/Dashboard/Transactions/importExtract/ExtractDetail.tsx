import { useGlobalContext } from "@/contexts/GlobalContext";
import { IPDFData } from "@/services/PDFReader/interfaces";
import selectT from "@/utils/selectT";
import { formatAnyDate } from "../../../../utils/date/formatAnyDate";
import { valueToCurrency } from "../../../../utils/misc";
import { TRANSACTION_TYPE_LABELS } from "@/static/staticLabels";
import { TransactionRow } from "./components/TransactionRow";
import { TransactionCell } from "./components/TransactionCell";
import { Title } from "./components/Title";

type ExtractDetailProps = {
  pdfData: IPDFData;
  pdfIndex: number;
};

export const ExtractDetail = ({ pdfData, pdfIndex }: ExtractDetailProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <div>
        <Title>
          {selectT(currentLanguage, {
            en: "General Information",
            pt: "Informações Gerais",
          })}
        </Title>
        <div>
          <span>
            {selectT(currentLanguage, {
              en: "Initial Balance",
              pt: "Saldo Inicial",
            })}
          </span>
          {": "}
          {pdfData.initialBalance}
        </div>
        <div>
          <span>
            {selectT(currentLanguage, {
              en: "Final Balance",
              pt: "Saldo Final",
            })}
          </span>
          {": "}
          {pdfData.finalBalance}
        </div>
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
              <TransactionRow key={`trans-${pdfIndex}-${index}`}>
                <TransactionCell width={150} transactionType={transaction.type}>
                  {amountFormatted}
                </TransactionCell>
                <TransactionCell width={150} label="Tipo">
                  {transactionTypeLabel}
                </TransactionCell>
                <TransactionCell label="Descrição"
                  width={350}
                >
                  {transaction.description}
                </TransactionCell>
                <TransactionCell label="Data">
                  {formattedDate}
                </TransactionCell>
              </TransactionRow>
            );
          })}
        </div>
      </div>
    </>
  );
};



