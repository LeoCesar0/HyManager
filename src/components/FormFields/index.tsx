import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { LocalizedText } from "../../@types/index";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Control, UseFormReturn } from "react-hook-form";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { If } from "react-if";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ISelectOption } from "@/@types/Select";
import { CurrencyInput } from "../CurrencyInput/index";
import useT from "@/hooks/useT";
import { TransactionType } from "../../server/models/Transaction/schema";
import { clsx } from "clsx";
import { TransactionTypeRadio } from "../TransactionTypeRadio";
import { DatePicker } from "../DatePicker/index";

interface IMainProps {
  name: string;
  label: LocalizedText;
}

interface IInput extends IMainProps {
  inputType: "input";
  props?: InputHTMLAttributes<HTMLInputElement>;
}

interface IDatePicker extends IMainProps {
  inputType: "datePicker";
}

interface ITransactionType extends IMainProps {
  inputType: "transactionType";
}

interface ICurrencyInput extends IMainProps {
  inputType: "currency";
  props?: InputHTMLAttributes<HTMLInputElement>;
}

interface ITextArea extends IMainProps {
  inputType: "textarea";
  props?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

interface ISelect extends IMainProps {
  inputType: "select";
  options: ISelectOption[];
}

export type IFormFieldItem =
  | IInput
  | IDatePicker
  | ITextArea
  | ISelect
  | ICurrencyInput
  | ITransactionType;

interface IProps {
  fields: IFormFieldItem[];
  form: UseFormReturn<any, any, undefined>;
}

export const FormFields: React.FC<IProps> = ({ fields, form }) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      {fields.map((item) => {
        return (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>{item.label[currentLanguage]}</FormLabel>
                  <FormControl>
                    <>
                      {item.inputType === "input" && (
                        <Input {...field} {...(item.props || {})} />
                      )}
                      {item.inputType === "currency" && (
                        <>
                          <CurrencyInput
                            currency="BRL"
                            onValueChange={(value) => {
                              form.setValue(item.name, value);
                            }}
                            {...field}
                            {...(item.props || {})}
                          />
                        </>
                      )}
                      {item.inputType === "textarea" && (
                        <Textarea {...field} {...(item.props || {})} />
                      )}
                      {item.inputType === "transactionType" && (
                        <>
                          <TransactionTypeRadio
                            currentValue={field.value}
                            fieldName={item.name}
                            setValue={form.setValue}
                          />
                        </>
                      )}
                      {item.inputType === "datePicker" && (
                        <>
                          <div>
                            <DatePicker
                              date={field.value}
                              setDate={(date: Date) => {
                                form.setValue(item.name, date);
                              }}
                            />
                          </div>
                        </>
                      )}
                      {item.inputType === "select" && (
                        <>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="text-sm font-semibold uppercase w-full max-w-[300px] ">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options.map((option) => {
                                return (
                                  <SelectItem
                                    className="uppercase"
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label[currentLanguage]}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
        );
      })}
    </>
  );
};
