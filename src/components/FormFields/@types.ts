import { LocalizedText } from "@/@types";
import { FileInfo, TempImage } from "@/@types/File";
import { ISelectOption } from "@/@types/Select";
import { Dispatch, InputHTMLAttributes, SetStateAction, TextareaHTMLAttributes } from "react";
import { UseFormReturn } from "react-hook-form";

interface IMainProps<T> {
    name: keyof T;
    label: LocalizedText;
  }
  
  interface IInput<T> extends IMainProps<T> {
    inputType: "input";
    props?: InputHTMLAttributes<HTMLInputElement>;
  }
  
  export interface IImageInput<T> extends IMainProps<T> {
    inputType: "imageInput";
    props?: InputHTMLAttributes<HTMLInputElement>;
    tempImages: TempImage[];
    setTempImages: Dispatch<SetStateAction<TempImage[]>>;
  }
  
  interface IDatePicker<T> extends IMainProps<T> {
    inputType: "datePicker";
  }
  
  interface ITransactionType<T> extends IMainProps<T> {
    inputType: "transactionType";
  }
  
  interface ICurrencyInput<T> extends IMainProps<T> {
    inputType: "currency";
    props?: InputHTMLAttributes<HTMLInputElement>;
  }
  
  interface ITextArea<T> extends IMainProps<T> {
    inputType: "textarea";
    props?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  }
  
  interface ISelect<T> extends IMainProps<T> {
    inputType: "select";
    options: ISelectOption[];
  }
  
  export type IFormFieldItem<T> =
    | IInput<T>
    | IImageInput<T>
    | IDatePicker<T>
    | ITextArea<T>
    | ISelect<T>
    | ICurrencyInput<T>
    | ITransactionType<T>;
  
  export interface IFormFieldProps {
    fields: IFormFieldItem<Record<string, any>>[];
    form: UseFormReturn<any, any, undefined>;
  }

  export type MakeFormFields<T> = IFormFieldItem<T>[]