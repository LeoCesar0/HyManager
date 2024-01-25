import { useGlobalContext } from "@/contexts/GlobalContext";
import { IPDFData } from "@/services/PDFReader/interfaces";
import selectT from "@/utils/selectT";
import { formatAnyDate } from "../../../../../utils/date/formatAnyDate";
import { valueToCurrency } from "../../../../../utils/misc";
import { TRANSACTION_TYPE_LABELS } from "@/static/staticLabels";
import { TransactionRow } from "./TransactionRow";
import { TransactionCell } from "./TransactionCell";
import { Title } from "./Title";
import { LocalizedText } from "@/@types";

type ExtractGeneralInfoProps = {
  pdfData: IPDFData;
};

export const ExtractGeneralInfo = ({ pdfData }: ExtractGeneralInfoProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <Title>
        {selectT(currentLanguage, {
          en: "General Information",
          pt: "Informações Gerais",
        })}
      </Title>

      {infos.map(({ key, label }) => {
        return (
          <div key={key}>
            <span>{selectT(currentLanguage, label)}</span>
            {": "}
            {valueToCurrency(pdfData[key] as number)}
          </div>
        );
      })}
    </>
  );
};

const infos: {
  label: LocalizedText;
  key: keyof IPDFData;
}[] = [
  {
    key: "initialBalance",
    label: {
      en: "Initial Balance",
      pt: "Saldo Inicial",
    },
  },
  {
    key: "income",
    label: {
      en: "Income",
      pt: "Renda",
    },
  },
  {
    key: "totalCredit",
    label: {
      en: "Total Credit",
      pt: "Crédito Total",
    },
  },
  {
    key: "totalDebit",
    label: {
      en: "Total Debit",
      pt: "Débito Total",
    },
  },
  {
    key: "finalBalance",
    label: {
      en: "Final Balance",
      pt: "Saldo Final",
    },
  },
];
