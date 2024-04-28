import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { BankCategory } from "@/server/models/BankAccount/schema";
import selectT from "@/utils/selectT";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CATEGORIES } from "@/server/models/BankAccount/static";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./CategoryForm";
import { MdEdit } from "react-icons/md";

export const BankCategories = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [itemOnEdit, setItemOnEdit] = useState<BankCategory | null>(null);

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

  useEffect(() => {
    if (!formIsOpen) {
      setItemOnEdit(null);
    }
  }, [formIsOpen]);

  useEffect(() => {
    if (itemOnEdit) {
      setFormIsOpen(true);
    }
  }, [itemOnEdit]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <header className="py-4">
          <Button
            onClick={() => setFormIsOpen(!formIsOpen)}
            variant={"secondary"}
          >
            {formIsOpen ? cancelText : newCategoryText}
          </Button>
        </header>
        {formIsOpen && (
          <CategoryForm
            initialValues={itemOnEdit ?? undefined}
            closeForm={() => setFormIsOpen(false)}
          />
        )}
        {!formIsOpen && (
          <ul className="grid grid-cols-1 w-full">
            {categories.map((category) => {
              return (
                <li
                  key={category.slug}
                  className="w-full p-4 border-border border-b flex items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="rounded-full w-6 h-6 "
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="">{category.name}</span>
                  </div>
                  <Button
                    size={"iconSm"}
                    variant={"secondary"}
                    onClick={() => {
                      setItemOnEdit(category);
                    }}
                  >
                    <MdEdit />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};
