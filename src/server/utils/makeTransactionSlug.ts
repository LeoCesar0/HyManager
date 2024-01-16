import { format } from "date-fns";
import { slugify } from "@/utils/app";
import { formatAnyDate } from "@/utils/date/formatAnyDate";

interface IMakeTransactionSlug {
  amount: number;
  date: string | Date;
  idFromBank?: string;
  creditor: string;
}
export const makeTransactionSlug = ({
  amount,
  date,
  idFromBank,
  creditor,
}: IMakeTransactionSlug) => {
  if(typeof date !== 'string' || date.includes('T')){
    date = formatAnyDate(date, "yyyy-MM-dd")
  }

  const creditorSlug = creditor ? slugify(creditor) : "";
  let slug = `$$${amount.toString()}`;
  slug += "TT";
  slug += date
  if (creditorSlug) {
    slug += "@@";
    slug += creditorSlug;
  }
  slug += "##";
  const idFromBank_ = idFromBank ? idFromBank : "manual";
  slug += idFromBank_;
  return slug;
};
