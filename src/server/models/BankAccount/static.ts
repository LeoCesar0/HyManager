import { DefaultBankCategory } from "./schema";

export const DEFAULT_CATEGORY = {
  "home-bills-default": {
    color: "#f1c7a0",
    isDefault: true,
    name: {
      en: "Home Bills",
      pt: "Contas de Casa",
    },
    slug: "home-bills-default",
    id: "home-bills-default",
  },
  "grocery-default": {
    color: "#c7f1a0",
    isDefault: true,
    name: {
      en: "Grocery",
      pt: "Mercado",
    },
    slug: "grocery-default",
    id: "grocery-default",
  },
  "health-default": {
    color: "#0fffaf",
    isDefault: true,
    name: {
      pt: "Saúde",
      en: "Health",
    },
    slug: "health-default",
    id: "health-default",
  },
  "fun-default": {
    color: "#c7a0f1",
    isDefault: true,
    name: {
      en: "Leisure",
      pt: "Lazer",
    },
    slug: "fun-default",
    id: "fun-default",
  },
  "investment-default": {
    color: "#FFa037",
    isDefault: true,
    name: {
      en: "Investment",
      pt: "Investimento",
    },
    slug: "investment-default",
    id: "investment-default",
  },
  "invoice-default": {
    color: "#FF1050",
    isDefault: true,
    name: {
      en: "Invoicing Card",
      pt: "Fatura de Cartão",
    },
    slug: "invoice-default",
    id: "invoice-default",
  },
  "other-default": {
    color: "#a0c7f1",
    isDefault: true,
    name: {
      en: "Other",
      pt: "Outro",
    },
    slug: "other-default",
    id: "other-default",
  },
} as const;

export const DEFAULT_CATEGORIES: DefaultBankCategory[] =
  Object.values(DEFAULT_CATEGORY);
