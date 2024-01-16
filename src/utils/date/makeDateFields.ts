import { format } from "date-fns";

export const makeDateFields = (
    date: Date
  ): {
    dateDay: string;
    dateMonth: string;
    dateYear: string;
    dateWeek: string;
  } => {
    const day = format(date, "dd");
    const month = format(date, "MM");
    const year = format(date, "yyyy");
    const week = format(date, "Q");
    return {
      dateDay: day,
      dateMonth: month,
      dateYear: year,
      dateWeek: week,
    };
  };