import { LocalizedText } from "@/@types";
import { TempImage } from "@/@types/File";
import { ISelectOption } from "@/@types/Select";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { UseFormReturn } from "react-hook-form";

interface IMainProps {
    name: string;
    label: LocalizedText;
  }
  
  interface IInput extends IMainProps {
    inputType: "input";
    props?: InputHTMLAttributes<HTMLInputElement>;
  }
  
  export interface IImageInput extends IMainProps {
    inputType: "imageInput";
    props?: InputHTMLAttributes<HTMLInputElement>;
    tempImages: TempImage[];
    setTempImages: (TempImage: TempImage[]) => void;
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
    | IImageInput
    | IDatePicker
    | ITextArea
    | ISelect
    | ICurrencyInput
    | ITransactionType;
  
  export interface IFormFieldProps {
    fields: IFormFieldItem[];
    form: UseFormReturn<any, any, undefined>;
  }