import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

type CxItemType = undefined | string | [string, boolean];
type CxPropsType = CxItemType[];

export const cx = (arrayProps: CxPropsType): string => {
  let finalClassName = "";

  for (const item of arrayProps) {
    if (item) {
      if (typeof item === "string") {
        finalClassName += ` ${item} `;
      } else {
        const [itemClassName, itemBoolean] = item;
        if (itemBoolean === true) {
          finalClassName += ` ${itemClassName} `;
        }
      }
    }
  }
  return finalClassName;
};

export const debugLog = (variable: any, name: string) => {
  console.log(`${name} -->`, variable);
};

export const dateToIsoString = (date: Date, { withTimeZone = true }) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");

  let isoString =
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes());

  if (withTimeZone) {
    isoString +=
      ":" +
      pad(date.getSeconds()) +
      diff +
      pad(tzOffset / 60) +
      ":" +
      pad(tzOffset % 60);
  }

  return isoString;
};

export function getTimezoneOffset() {
  const date = new Date();
  const timezoneOffsetInMinutes = date.getTimezoneOffset();
  const absTimezoneOffsetInMinutes = Math.abs(timezoneOffsetInMinutes);
  const hours = Math.floor(absTimezoneOffsetInMinutes / 60);
  const minutes = absTimezoneOffsetInMinutes % 60;
  const sign = timezoneOffsetInMinutes > 0 ? "-" : "+";

  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export const timestampToDate = (timestamp: Timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date;
};

export const valueToCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const formatAnyDate = (
  date: string | number | Date | Timestamp,
  dateFormat: string = "dd/MM/yyyy"
) => {
  try {
    if (typeof date === "string") {
      const isUnix = /^\d+$/.test(date);
      if (isUnix) {
        date = Number(date);
        return format(date, dateFormat);
      }
      date = new Date(date);
      return format(date, dateFormat);
    }
    if (typeof date === "number") {
      return format(date, dateFormat);
    }
    if (date instanceof Date) {
      return format(date, dateFormat);
    }

    if (date instanceof Timestamp) {
      date = timestampToDate(date);
      return format(date, dateFormat);
    }

    return "";
  } catch (err) {
    console.log("formatAnyDate err -->", date, err);
    return "";
  }
};

export const numericFromAnyFormatToNumber = (string: string) => {
  string = string.replace('+', '')
  if(!string) return null

  const hasComma = string.includes(",");
  const hasDot = string.includes(".");
  const hasMultiplesDots =
    string.split("").filter((item) => item === ".").length > 1;
  /* 
    ACCEPT THE FOLLOWING FORMATS AND CONVERT TO FLOAT
		1000.50
		1000
		2,200,100.50 --> NEED TO CONVERT
		2.200.100,50 --> NEED TO CONVERT
		1.100,50 --> NEED TO CONVERT
		1000,50 --> NEED TO CONVERT
    */
  if (hasMultiplesDots) {
    string = string.replaceAll(".", "");
    string = string.replaceAll(",", ".");
    const number = Number(string);
    if (isNaN(number)) return null;
    return number;
  }

  if (hasComma && !hasDot) {
    string = string.replaceAll(",", ".");
    const number = Number(string);
    if (isNaN(number)) return null;
    return number;
  }

  if (hasComma && hasDot) {
    const indexOfComma = string.indexOf(",");
    const indexOfDot = string.indexOf(".");
    if (indexOfComma < indexOfDot) {
      string = string.replaceAll(",", "");
    }
    if (indexOfComma > indexOfDot) {
      string = string.replaceAll(".", "");
      string = string.replaceAll(",", ".");
    }
  }

  const number = Number(string);
  if (isNaN(number)) return null;
  return number;
};
