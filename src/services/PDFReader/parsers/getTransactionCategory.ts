import { DEFAULT_CATEGORY } from "@/server/models/BankAccount/static";
import { slugify } from "@/utils/app";

const funCreditors = ["bebida", "deposito", "bar-", "ifood"];

const groceryCreditors = [
  "supermercado",
  "mercado",
  "hipermercado",
  "comercio",
  "assai",
  "r-carvalho",
  "carvalho-super",
  "alimento",
  "frango",
];

const healthCreditors = ["drogaria", "farmacia", "clinica", "hospital", 'saude'];

const homeBillsCreditor = ["equatorial"];

export const getTransactionCategory = ({
  description,
  creditor,
}: {
  description: string;
  creditor: string;
}) => {
  const descriptionSlug = slugify(description);

  // --------------------------
  // INVESTMENT
  // --------------------------
  if (descriptionSlug.includes("aplicacao")) {
    return [DEFAULT_CATEGORY["investment-default"].id];
  }
  if (descriptionSlug.includes("invest")) {
    return [DEFAULT_CATEGORY["investment-default"].id];
  }
  if (descriptionSlug.includes("fundo")) {
    return [DEFAULT_CATEGORY["investment-default"].id];
  }
  if (descriptionSlug.includes("fii")) {
    return [DEFAULT_CATEGORY["investment-default"].id];
  }
  if (descriptionSlug.includes("resgate")) {
    return [DEFAULT_CATEGORY["investment-default"].id];
  }
  if (descriptionSlug.includes("acoes")) {
    return [DEFAULT_CATEGORY["investment-default"].id];
  }
  // --------------------------
  // INVOICE
  // --------------------------
  if (descriptionSlug.includes("fatura")) {
    return [DEFAULT_CATEGORY["invoice-default"].id];
  }
  // --------------------------
  // BILLS
  // --------------------------
  if (descriptionSlug.includes("boleto")) {
    return [DEFAULT_CATEGORY["home-bills-default"].id];
  }

  if (creditor) {
    let found: any = undefined;

    const creditorSlug = slugify(creditor);

    // --------------------------
    // GROCERY
    // --------------------------
    found = groceryCreditors.find((item) => creditorSlug.includes(item));
    if (found) return [DEFAULT_CATEGORY["grocery-default"].id];

    // --------------------------
    // FUN
    // --------------------------
    found = funCreditors.find((item) => creditorSlug.includes(item));
    if (found) return [DEFAULT_CATEGORY["fun-default"].id];

    // --------------------------
    // HEALTH
    // --------------------------

    found = healthCreditors.find((item) => creditorSlug.includes(item));
    if (found) return [DEFAULT_CATEGORY["health-default"].id];
    // --------------------------
    // HOME BILLS
    // --------------------------

    found = homeBillsCreditor.find((item) => creditorSlug.includes(item));
    if (found) return [DEFAULT_CATEGORY["home-bills-default"].id];
  }

  return [];
};
