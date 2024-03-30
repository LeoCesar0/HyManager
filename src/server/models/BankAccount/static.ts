import { DefaultBankCategory } from "./schema";

export const DEFAULT_BANK_CATEGORIES: DefaultBankCategory[] = [
  {
    color: "#f1c7a0",
    isDefault: true,
    name: {
      en: "Home Bills",
      pt: "Contas de Casa",
    },
    slug: "home-bills-default",
  },
  {
    color: "#c7f1a0",
    isDefault: true,
    name: {
      en: "Grocery",
      pt: "Mercado",
    },
    slug: "grocery-default",
  },
  {
    color: "#c7a0f1",
    isDefault: true,
    name: {
      en: "Entertaining",
      pt: "Entretenimento",
    },
    slug: "fun-default",
  },
  {
    color: "#a0c7f1",
    isDefault: true,
    name: {
      en: "Other",
      pt: "Outro",
    },
    slug: "other-default",
  },
];
