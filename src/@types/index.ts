import { IconProps } from "@radix-ui/react-icons/dist/types";
import { FirebaseCollection } from "@server/firebase";
import { WhereFilterOp } from "firebase/firestore";
import { IconType } from "react-icons/lib";

export type AppError = {
  message: string;
} | null;

export type AppModelResponse<T> = {
  error: AppError;
  done: boolean;
  data: T | null;
};

export type AppBaseDocFields<T> = T & {
  createdAtDay: string;
  createdAtMonth: string;
  createdAtYear: string;
  createdAtWeek: string;
};

export type ReactNode<T = {}> = React.FC<{children:React.ReactNode} & T>

export type CSVData = string[][];

export enum Locale {
  en = "en",
  pt = "pt",
}

export type LocalizedText = {
  [key in Locale]: string;
};

export type AnyObject = {
  [key: string | number | symbol]: any;
};

export type FirebaseFilterFor<T> = {
  field: keyof T;
  operator: WhereFilterOp;
  value: any;
};

export type RefetchCollection = (collection: FirebaseCollection[]) => void;

export type AppIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>> | IconType