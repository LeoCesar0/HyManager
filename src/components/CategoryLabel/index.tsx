import { LocalizedText } from "@/@types";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { getCurrentBankCategories } from "@/utils/getCurrentBankCategories";
import selectT from "@/utils/selectT";
import { useMemo } from "react";

export const CategoryLabel = ({
  categoryId,
  label,
}: {
  categoryId: string;
  label: LocalizedText | string;
}) => {
  const { currentLanguage } = useGlobalContext();
  const { currentBankAccount } = useGlobalDashboardStore();

  const categories = useMemo(() => {
    return getCurrentBankCategories({
      currentBankAccount,
      currentLanguage,
    });
  }, [currentBankAccount, currentLanguage]);

  const category = categories.get(categoryId);

  return (
    <>
      <div className="flex items-center gap-2">
        {category && (
          <span
            className="h-3 w-3 rounded-full "
            style={{ backgroundColor: category.color }}
          ></span>
        )}
        <span>
          {typeof label === "string" ? label : selectT(currentLanguage, label)}
        </span>
      </div>
    </>
  );
};
