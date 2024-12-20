import { IconProps } from "@radix-ui/react-icons/dist/types";
import { FirebaseCollection } from "@server/firebase";
import { WhereFilterOp } from "firebase/firestore";
import { IconType } from "react-icons/lib";

export type AppError = {
  message: string;
} | null;

export type AppModelResponse<T> =
  | {
      data: null;
      done: false;
      error: AppError;
    }
  | {
      data: T;
      done: true;
      error: null;
    };

export type AppBaseDocFields<T> = T & {
  createdAtDay: string;
  createdAtMonth: string;
  createdAtYear: string;
  createdAtWeek: string;
};

export type ReactNode<T = {}> = React.FC<{ children: React.ReactNode } & T>;

export type CSVData = string[][];

export enum Locale {
  en = "en",
  pt = "pt",
}

export type LocalizedText = {
  [key in Locale]: string;
};

export type AnyObject = Record<string, any>;

export type FirebaseFilterFor<T> = {
  field: keyof T;
  operator: WhereFilterOp;
  value: any;
};

export type RefetchCollection = (collection: FirebaseCollection[]) => void;

export type AppIcon =
  | React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<SVGSVGElement>
    >
  | IconType;

export type Pagination = {
  page: number;
  limit: number;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
};
export type PaginationResult<T> = {
  count: number;
  pages: number;
  list: T[];
  currentPage: number;
};
