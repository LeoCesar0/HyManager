import { IFormFieldItem } from "@/components/FormFields";
import { TransactionType } from "../../../../server/models/Transaction/schema";

export const formFields: IFormFieldItem[] = [
  {
    name: "amount",
    label: {
      en: "Amount",
      pt: "Valor",
    },
    inputType: "currency",
    props: {
      placeholder: "R$ 100,00",
    },
  },
  {
    name: "type",
    label: {
      en: "Type",
      pt: "Tipo",
    },
    inputType: "transactionType",
  },
  {
    name: "creditor",
    label: {
      en: "Creditor",
      pt: "Credor",
    },
    inputType: "input",
  },
  {
    name: "description",
    label: {
      en: "Description",
      pt: "Descrição",
    },
    inputType: "textarea",
  },
  {
    name: "date",
    label: {
      en: "Date",
      pt: "Data",
    },
    inputType: "datePicker",
  },
  // {
  //   name: "date",
  //   label: {
  //     en: "Date",
  //     pt: "Data",
  //   },
  //   props: {
  //     type: "date",
  //   },
  //   inputType: "input",
  // },
];
