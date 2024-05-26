import React, { useMemo } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ISelectOption } from "@/@types/Select";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useGlobalContext } from "@/contexts/GlobalContext";
import selectT from "@/utils/selectT";
import { Locale } from "@/@types";

type CustomItem = React.FC<{ option: ISelectOption }>;

export type MultipleSelectProps = {
  label?: string;
  options: ISelectOption[];
  markAllOption?: ISelectOption;
  value: string[];
  CustomLabel?: CustomItem;
  onChange(value: string[]): void;
  disabled?: boolean;
};

export const MultipleSelect = ({
  disabled,
  label,
  value,
  options,
  onChange,
  markAllOption,
  CustomLabel,
  ...rest
}: MultipleSelectProps) => {
  const { currentLanguage } = useGlobalContext();

  const selectedOptionsLabels = value
    .map((item) => {
      const option = options.find((option) => option.value === item);
      return option ? selectT(currentLanguage, option.label) : item;
    })
    .join(", ");

  return (
    <div className="">
      {label && <Label className={disabled ? "opacity-50" : ""}>{label}</Label>}
      <Select {...rest} disabled={disabled}>
        <SelectTrigger className="w-[250px]">
          <span className="truncate pr-1">{selectedOptionsLabels}</span>
        </SelectTrigger>
        <SelectContent>
          {markAllOption && (
            <SelectItemWrapper
              option={markAllOption}
              checked={value.length === options.length}
              onClick={() => {
                if (value.length === options.length) {
                  onChange([]);
                } else {
                  onChange(options.map((option) => option.value));
                }
              }}
              currentLanguage={currentLanguage}
            />
          )}
          {options.map((option) => {
            const checked = value.some((item) => item === option.value);

            return (
              <SelectItemWrapper
                key={option.value}
                option={option}
                checked={checked}
                onClick={() => {
                  const selectedValue = option.value;
                  const checked = value.some((item) => item === selectedValue);
                  if (checked) {
                    const val = value.filter((item) => item !== selectedValue);
                    onChange(val);
                  } else {
                    onChange([...value, selectedValue]);
                  }
                }}
                currentLanguage={currentLanguage}
                CustomLabel={CustomLabel}
              />
              // <div
              //   key={option.value}
              //   onClick={() => {
              //     const selectedValue = option.value;
              //     console.log("onClick", selectedValue);
              //     const checked = value.some((item) => item === selectedValue);
              //     console.log("checked", checked);
              //     if (checked) {
              //       const val = value.filter((item) => item !== selectedValue);
              //       console.log("val", val);
              //       onChange(val);
              //     } else {
              //       onChange([...value, selectedValue]);
              //     }
              //   }}
              //   className="cursor-pointer"
              // >
              //   <SelectItem
              //     value={option.value}
              //     disableIndicator
              //     className="pointer-events-none"
              //   >
              //     <CheckIcon
              //       className={cn(
              //         "mr-2 h-4 w-4",
              //         checked ? "opacity-100" : "opacity-0"
              //       )}
              //     />
              //     <span>{label}</span>
              //   </SelectItem>
              // </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

MultipleSelect.displayName = "MultipleSelect";

const SelectItemWrapper = ({
  onClick,
  checked,
  CustomLabel,
  option,
  currentLanguage,
}: {
  option: ISelectOption;
  checked: boolean;
  onClick: () => void;
  CustomLabel?: CustomItem;
  currentLanguage: Locale;
}) => {
  const label = selectT(currentLanguage, option.label);
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
      className="cursor-pointer hover:bg-accent"
    >
      <SelectItem
        value={option.value}
        disableIndicator
        className="pointer-events-none"
      >
        <CheckIcon
          className={cn("mr-2 h-4 w-4", checked ? "opacity-100" : "opacity-0")}
        />
        {CustomLabel && <CustomLabel option={option} />}
        {!CustomLabel && <span>{label}</span>}
      </SelectItem>
    </div>
  );
};
