import { ITableColumn } from "@/@types/Table";
import selectT from "@/utils/selectT";
import { Locale } from "@/@types";
import { BankCreditor } from "@/server/models/BankCreditor/schema";

export const getColumns = ({
  currentLanguage,
}: {
  currentLanguage: Locale;
}) => {
  const columns: ITableColumn<BankCreditor>[] = [
    {
      key: "creditor",
      label: selectT(currentLanguage, {
        en: "Beneficiary",
        pt: "Beneficiário",
      }),
    },
    {
      key: "categories",
      label: selectT(currentLanguage, {
        en: "Category",
        pt: "Categoria",
      }),
    },
  ];
  return columns;
};
