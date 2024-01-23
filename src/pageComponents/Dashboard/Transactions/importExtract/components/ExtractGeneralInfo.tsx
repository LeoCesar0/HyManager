import { useGlobalContext } from "@/contexts/GlobalContext";
import { IPDFData } from "@/services/PDFReader/interfaces";
import selectT from "@/utils/selectT";
import { formatAnyDate } from "../../../../../utils/date/formatAnyDate";
import { valueToCurrency } from "../../../../../utils/misc";
import { TRANSACTION_TYPE_LABELS } from "@/static/staticLabels";
import { TransactionRow } from "./TransactionRow";
import { TransactionCell } from "./TransactionCell";
import { Title } from "./Title";

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
    </>
  );
};
