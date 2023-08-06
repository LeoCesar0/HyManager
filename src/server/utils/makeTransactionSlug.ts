import { slugify } from "src/utils/app";

interface IMakeTransactionSlug {
    amount: string;
    date: string;
    idFromBank?: string;
    creditor: string;
  }
  export const makeTransactionSlug = ({
    amount,
    date,
    idFromBank,
    creditor,
  }: IMakeTransactionSlug) => {
    const creditorSlug = creditor ? slugify(creditor) : "";
    let slug = `$$${slugify(amount)}`;
    slug += "&&";
    slug += slugify(date.slice(0, 10));
    if (creditorSlug) {
      slug += "@@";
      slug += creditorSlug
    }
    slug += "##";
    const idFromBank_ = idFromBank ? idFromBank : "manual";
    slug += idFromBank_;
    return slug;
  };
  