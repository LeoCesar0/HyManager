import {
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from "react";
import { LocalizedText } from "../../@types/index";
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
import Image from "next/image";
import { PlusIcon } from "@radix-ui/react-icons";
import { getImageData } from "@/utils/getImageData";
import { IFormFieldProps } from "./@types";


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
                          <div className="flex gap-2 flex-wrap">
                            {itemField.tempImages.map((imageUrl) => {
                              return (
                                <Image
                                  src={imageUrl.previewUrl}
                                  key={imageUrl.previewUrl}
                                  alt="image preview"
                                  width={64}
                                  height={64}
                                  className="rounded-md cursor-pointer"
                                />
                              );
                            })}
                            <label htmlFor={itemField.name}>
                              <PlusIcon className="h-16 w-16 rounded-md border cursor-pointer text-muted-foreground" />
                            </label>
                            <Input
                              className="hidden"
                              type="file"
                              {...(itemField.props || {})}
                              name={itemField.name}
                              id={itemField.name}
                              onChange={(event) => {
                                const { tempImages } = getImageData(event);

                                itemField.setTempImages(tempImages);
                              }}
                            />
                          </div>
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
