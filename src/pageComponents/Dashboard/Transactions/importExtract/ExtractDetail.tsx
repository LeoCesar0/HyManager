import { useGlobalContext } from "@/contexts/GlobalContext";
import { IPDFData } from "@/services/PDFReader/interfaces";
import selectT from "@/utils/selectT";
import { ReactNode } from "react";
import { formatAnyDate } from "../../../../utils/date/formatAnyDate";
import { valueToCurrency } from "../../../../utils/misc";
import { TransactionType } from "../../../../server/models/Transaction/schema";
import { TRANSACTION_TYPE_LABELS } from "@/static/staticLabels";
import { cx } from "@/utils/misc";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

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

const Title = ({ children }: { children: ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b mb-4 py-2 ">
    {children}
  </h2>
);

const TransactionRow = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 items-center justify-start p-2 bg-card rounded-lg border">
    {children}
  </div>
);

const TransactionCell = ({
  children,
  width = 250,
  label,
  transactionType,
}: {
  children: ReactNode;
  width?: number;
  label?: string;
  transactionType?: TransactionType;
}) => {
  return (
    <div
      className={cx([
        `px-2 py-1 rounded-sm line-clamp-2 flex items-start justify-start gap-2 text-sm`,
        ["text-credit", transactionType === TransactionType.credit],
        ["text-debit", transactionType === TransactionType.debit],
      ])}
      style={{
        width: `${width}px`,
      }}
    >
      {transactionType && transactionType === TransactionType.credit && (
        <ArrowUpIcon className="h-4 w-4" />
      )}
      {transactionType && transactionType === TransactionType.debit && (
        <ArrowDownIcon className="h-4 w-4" />
      )}
      {label && <span className="font-semibold">{label}{': '}</span>}
      {children}
    </div>
  );
};
