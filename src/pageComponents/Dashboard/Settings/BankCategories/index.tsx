import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { BankCategory } from "@/server/models/BankAccount/schema";
import selectT from "@/utils/selectT";
import { useMemo } from "react";
import { DEFAULT_CATEGORIES } from "@/server/models/BankAccount/static";

export const BankCategories = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();

  const categories = useMemo(() => {
    const _categories = currentBankAccount?.categories || [];
    const defaultCategories: BankCategory[] = DEFAULT_CATEGORIES.map(
      (category) => {
        return {
          color: category.color,
          name: selectT(currentLanguage, category.name),
          slug: category.slug,
          isDefault: true,
        };
      }
    );
    return _categories.concat(defaultCategories);
  }, [currentBankAccount?.categories, currentLanguage]);

  return (
    <>
      <ul className="grid grid-cols-1 w-full">
        {categories.map((category) => {
          return (
            <li
              key={category.slug}
              className="w-full p-4 border-border border-b flex items-center gap-4"
            >
              <div
                className="rounded-full w-6 h-6 "
                style={{ backgroundColor: category.color }}
              ></div>
              <div className="">{category.name}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
