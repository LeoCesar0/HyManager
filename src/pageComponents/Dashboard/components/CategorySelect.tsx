import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { BankCategory } from "@/server/models/BankAccount/schema";
import { getCurrentBankCategories } from "@/utils/getCurrentBankCategories";
import selectT from "@/utils/selectT";
import { useMemo } from "react";

export type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  defaultOption?: BankCategory;
  disabled?: boolean;
};

const ALL_CATEGORY_ID = "SELECT_ALL";

export const CategorySelect = ({
  value,
  onChange,
  defaultOption,
  disabled,
}: CategorySelectProps) => {
  const { currentLanguage } = useGlobalContext();
  const { currentBankAccount } = useGlobalDashboardStore();

  const categories = useMemo(() => {
    return getCurrentBankCategories({
      currentBankAccount,
      currentLanguage,
    });
  }, [currentBankAccount, currentLanguage]);

  const categoriesOptions: BankCategory[] = [
    ...(defaultOption ? [defaultOption] : []),
    ...Array.from(categories.values()),
  ];

  const categoryFilterLabel = selectT(currentLanguage, {
    en: "Category",
    pt: "Categoria",
  });

  return (
    <>
      <div className="">
        <Label className={disabled ? "opacity-50" : ""}>
          {categoryFilterLabel}
        </Label>
        <Select
          onValueChange={(value) => onChange(value)}
          value={value}
          disabled={disabled}
        >
          <SelectTrigger className="min-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoriesOptions.map((category) => {
              return (
                <SelectItem key={category.id} value={category.id}>
                  {category.id !== ALL_CATEGORY_ID && (
                    <div
                      className="h-3 w-3 rounded-full "
                      style={{ backgroundColor: category.color }}
                    ></div>
                  )}
                  <span>{category.name}</span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
