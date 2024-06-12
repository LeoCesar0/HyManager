import { ISelectOption } from "@/@types/Select";
import { CategoryLabel } from "@/components/CategoryLabel";
import { MultipleSelect } from "@/components/MultipleSelect/MultipleSelect";
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
  value: string[];
  onChange: (value: string[]) => void;
  defaultOption?: BankCategory;
  disabled?: boolean;
  width?: number;
  allEnabled?: boolean;
};

export const CategorySelect = ({
  value,
  onChange,
  defaultOption,
  disabled,
  width,
  allEnabled = false,
}: CategorySelectProps) => {
  const { currentLanguage } = useGlobalContext();
  const { currentBankAccount } = useGlobalDashboardStore();

  const categories = useMemo(() => {
    const _categories = getCurrentBankCategories({
      currentBankAccount,
      currentLanguage,
    });
    if (allEnabled) {
      onChange(Array.from(_categories.values()).map((item) => item.id));
    }
    return _categories;
  }, [currentBankAccount, currentLanguage]);

  const categoriesOptions: ISelectOption[] = [
    ...(defaultOption ? [defaultOption] : []),
    ...Array.from(categories.values()),
  ].map((category) => {
    return {
      label: {
        en: category.name,
        pt: category.name,
      },
      value: category.id,
    };
  });

  const categoryFilterLabel = selectT(currentLanguage, {
    en: "Category",
    pt: "Categoria",
  });

  return (
    <>
      <MultipleSelect
        label={categoryFilterLabel}
        options={categoriesOptions}
        value={value}
        onChange={onChange}
        disabled={disabled}
        width={width}
        CustomLabel={({ option }) => {
          return (
            <>
              <CategoryLabel categoryId={option.value} label={option.label} />
            </>
          );
        }}
        markAllOption={{
          label: {
            en: "All",
            pt: "Todas",
          },
          value: "ALL",
        }}
      />
    </>
  );
};
