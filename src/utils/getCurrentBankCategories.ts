import { Locale } from "@/@types";
import { BankAccount, BankCategory } from "@/server/models/BankAccount/schema";
import { DEFAULT_CATEGORIES } from "@/server/models/BankAccount/static";
import selectT from "./selectT";

export const getCurrentBankCategories = ({
  currentBankAccount,
  currentLanguage,
}: {
  currentBankAccount?: BankAccount | null;
  currentLanguage: Locale;
}) => {
  const categories = (currentBankAccount?.categories ?? [])
    .concat()
    .reduce<Map<string, BankCategory>>((acc, entry) => {
      acc.set(entry.id, entry);
      return acc;
    }, new Map<string, BankCategory>());

  DEFAULT_CATEGORIES.map((item) => {
    categories.set(item.id, {
      color: item.color,
      isDefault: item.isDefault,
      name: selectT(currentLanguage, item.name),
      slug: item.slug,
      id: item.id,
    });
  });

  return categories;
};
