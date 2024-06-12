import { cn } from "@/lib/utils";
import { numericStringToNumber } from "@/utils/format/numericStringToNumber";
import React, { InputHTMLAttributes, useRef } from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { INPUT_BASE_CLASS } from "../ui/input";

export interface MaskOptions {
  prefix?: string;
  suffix?: string;
  includeThousandsSeparator?: boolean;
  thousandsSeparatorSymbol?: string;
  allowDecimal?: boolean;
  decimalSymbol?: string;
  decimalLimit?: number;
  requireDecimal?: boolean;
  allowNegative?: boolean;
  allowLeadingZeroes?: boolean;
  integerLimit?: number;
}

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  currency: "BRL" | "USD" | "CUSTOM";
  maskOptions?: MaskOptions;
  onValueChange: (value: number | undefined) => void;
  enableUndefined?: boolean;
}

const defaultBRLMask: MaskOptions = {
  prefix: "R$ ",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ".",
  allowDecimal: true,
  decimalSymbol: ",",
  allowNegative: false,
  allowLeadingZeroes: false,
};

const defaultUSDMask: MaskOptions = {
  prefix: "$ ",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      maskOptions,
      className,
      currency,
      onValueChange,
      enableUndefined = false,
      value,
      ...inputProps
    },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState<string>(
      value === 0
        ? ""
        : typeof value === "string"
        ? value
        : typeof value === "number"
        ? value.toString()
        : ""
    );

    const defaultOptions =
      currency === "BRL"
        ? defaultBRLMask
        : currency === "USD"
        ? defaultUSDMask
        : {};

    const options = {
      ...defaultOptions,
      ...maskOptions,
    };
    const currencyMask = createNumberMask({
      ...options,
    });

    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
      event
    ) => {
      let stringValue = event.target.value;
      if (enableUndefined && !stringValue) {
        onValueChange(undefined);
        return;
      }
      setLocalValue(stringValue);

      stringValue = stringValue
        .replace(options.prefix || "", "")
        .replace(options.suffix || "", "")
        .replace(options.thousandsSeparatorSymbol || "", "")
        .replace(options.decimalSymbol || "", ".");

      const number = numericStringToNumber(stringValue);

      if (typeof number === "number") {
        onValueChange(number);
      }
    };

    return (
      <MaskedInput
        mask={currencyMask}
        className={cn(INPUT_BASE_CLASS, className)}
        inputMode="numeric"
        {...inputProps}
        value={localValue}
        onChange={handleOnChange}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

CurrencyInput.defaultProps = {
  maskOptions: defaultBRLMask,
};
