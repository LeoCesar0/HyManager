import { ITableColumn } from "@/@types/Table";
import selectT from "@/utils/selectT";
import { Transaction } from "@/server/models/Transaction/schema";
import { Locale } from "@/@types";

export const getColumns = ({
  currentLanguage,
}: {
  currentLanguage: Locale;
}) => {
  const columns: ITableColumn<Transaction>[] = [
    {
      key: "amount",
      label: selectT(currentLanguage, {
        en: "Amount",
        pt: "Valor",
      }),
    },
    {
      key: "creditor",
      label: selectT(currentLanguage, {
        en: "Creditor",
        pt: "Credor",
      }),
    },

    {
      key: "createdAt",
      label: selectT(currentLanguage, {
        en: "Created at",
        pt: "Criado em",
      }),
    },
    {
      key: "updatedAt",
      label: selectT(currentLanguage, {
        en: "Updated at",
        pt: "Atualizado em",
      }),
    },
  ];
  return columns;
};
