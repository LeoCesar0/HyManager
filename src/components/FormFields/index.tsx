import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CurrencyInput } from "../CurrencyInput/index";
import { TransactionTypeRadio } from "../TransactionTypeRadio";
import { DatePicker } from "../DatePicker/index";
import { IFormFieldProps } from "./@types";
import { ImageInput } from "./ImageInput";

export const FormFields: React.FC<IFormFieldProps> = ({ fields, form }) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      {fields.map((itemField) => {
        return (
          <FormField
            key={itemField.name}
            control={form.control}
            name={itemField.name}
            render={({ field }) => {
              return (
                <>
                  <FormItem>
                    <FormLabel>{itemField.label[currentLanguage]}</FormLabel>
                    <FormControl>
                      <>
                        {itemField.inputType === "input" && (
                          <Input {...field} {...(itemField.props || {})} />
                        )}
                        {itemField.inputType === "imageInput" && (
                          <ImageInput itemField={itemField} formValues={form.getValues()} />
                        )}
                        {itemField.inputType === "currency" && (
                          <>
                            <CurrencyInput
                              currency="BRL"
                              onValueChange={(value) => {
                                form.setValue(itemField.name, value);
                              }}
                              {...field}
                              {...(itemField.props || {})}
                            />
                          </>
                        )}
                        {itemField.inputType === "textarea" && (
                          <Textarea {...field} {...(itemField.props || {})} />
                        )}
                        {itemField.inputType === "transactionType" && (
                          <>
                            <TransactionTypeRadio
                              currentValue={field.value}
                              fieldName={itemField.name}
                              setValue={form.setValue}
                            />
                          </>
                        )}
                        {itemField.inputType === "datePicker" && (
                          <>
                            <div>
                              <DatePicker
                                date={field.value}
                                setDate={(date: Date) => {
                                  form.setValue(itemField.name, date);
                                }}
                              />
                            </div>
                          </>
                        )}
                        {itemField.inputType === "select" && (
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
                                {itemField.options.map((option) => {
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
              );
            }}
          />
        );
      })}
    </>
  );
};
