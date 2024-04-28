import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { BankCategory } from "@/server/models/BankAccount/schema";
import selectT from "@/utils/selectT";
import { useMemo, useState } from "react";
import { DEFAULT_CATEGORIES } from "@/server/models/BankAccount/static";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./CategoryForm";

export const BankCategories = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const [forIsOpen, setFormIsOpen] = useState(false);

  const categories = useMemo(() => {
    const _categories = currentBankAccount?.categories || [];
    const defaultCategories: BankCategory[] = DEFAULT_CATEGORIES.map(
      (category) => {
        return {
          ...category,
          name: selectT(currentLanguage, category.name),
        };
      }
    );
    return _categories.concat(defaultCategories);
  }, [currentBankAccount?.categories, currentLanguage]);

  const newCategoryText = selectT(currentLanguage, {
    en: "New Category",
    pt: "Nova Categoria",
  });
  const cancelText = selectT(currentLanguage, {
    en: "Cancel",
    pt: "Cancelar",
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <header className="py-4">
          <Button
            onClick={() => setFormIsOpen(!forIsOpen)}
            variant={"secondary"}
          >
            {forIsOpen ? cancelText : newCategoryText}
          </Button>
        </header>
        {forIsOpen && <CategoryForm />}
        {!forIsOpen && (
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
        )}
      </div>
    </>
  );
};
