import { useGlobalContext } from "@/contexts/GlobalContext";
import { IPDFData } from "@/services/PDFReader/interfaces";
import selectT from "@/utils/selectT";
import { valueToCurrency } from "../../../../../utils/misc";
import { Title } from "./Title";
import { LocalizedText } from "@/@types";
import { GeneralInfo } from "../@types";

type ExtractSummary = {
  pdfData: IPDFData | GeneralInfo;
};

export const ExtractSummary = ({ pdfData }: ExtractSummary) => {
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
        let value: number | undefined = undefined;
        if (key === "difference") {
          value = pdfData.totalCredit - Math.abs(pdfData.totalDebit);
        }

        if (key in pdfData) {
          // @ts-expect-error
          value = pdfData[key] as number;
        }

        if (value !== undefined) {
          return (
            <p key={key} className="mb-2">
              <span className="font-medium mr-2">
                {selectT(currentLanguage, label)}
                {": "}
              </span>
              <span className="text-lg font-semibold">
                {valueToCurrency(value)}
              </span>
            </p>
          );
        }

        return null;
      })}
    </>
  );
};

const infos: {
  label: LocalizedText;
  key: keyof IPDFData | string;
}[] = [
  {
    key: "totalCredit",
    label: {
      en: "Total Deposit",
      pt: "Depósito Total",
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
    key: "difference",
    label: {
      en: "Difference between deposit and debit",
      pt: "Diferença entrada e saída",
    },
  },
  {
    key: "initialBalance",
    label: {
      en: "Initial Balance",
      pt: "Saldo Inicial",
    },
  },
  {
    key: "finalBalance",
    label: {
      en: "Final Balance",
      pt: "Saldo Final",
    },
  },
  {
    key: "income",
    label: {
      en: "Income",
      pt: "Rendimento",
    },
  },
];
