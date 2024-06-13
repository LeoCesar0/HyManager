import { ISelectOption } from "@/@types/Select";
import { CategoryLabel } from "@/components/CategoryLabel";
import { MultipleSelect } from "@/components/MultipleSelect/MultipleSelect";
import { TransactionTypeIcon } from "@/components/TransactionTypeIcon";
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
import { TransactionType } from "@/server/models/Transaction/schema";
import selectT from "@/utils/selectT";

export type TransactionTypeSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  defaultOption?: BankCategory;
  disabled?: boolean;
  width?: number;
};

const typeOptions: ISelectOption[] = [
  {
    label: {
      en: "Deposit",
      pt: "Depósito",
    },
    value: TransactionType.deposit,
  },
  {
    label: {
      en: "Withdraw",
      pt: "Saque",
    },
    value: TransactionType.debit,
  },
];

export const TransactionTypeSelect = ({
  value,
  onChange,
  disabled,
}: TransactionTypeSelectProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <MultipleSelect
        allEnabled
        disabled={disabled}
        label={selectT(currentLanguage, {
          en: "Type of transaction",
          pt: "Tipo de transação",
        })}
        options={typeOptions}
        value={value}
        onChange={onChange}
        width={200}
        CustomLabel={({ option }) => {
          const label = option.label;
          return (
            <>
              <div className="flex items-center gap-2">
                <TransactionTypeIcon type={option.value as TransactionType} />
                <span>
                  {typeof label === "string"
                    ? label
                    : selectT(currentLanguage, label)}
                </span>
              </div>
            </>
          );
        }}
      />
    </>
  );
};
