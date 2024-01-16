import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { timestampToDate } from "./timestampToDate";

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
      // --------------------------
      // ISO STRING
      // --------------------------
      if (!date.includes("T")) date = date + "T00:00:00-03:00";
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

    return "Invalid Date";
  } catch (err) {
    console.log("formatAnyDate err -->", date, err);
    return "Invalid Date";
  }
};
