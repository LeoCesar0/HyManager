import currency from "currency.js";
import { CSVData } from "@types-folder/index";
import { parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreateTransaction, createTransactionSchema, TransactionType } from "@models/Transaction/schema";
import { makeTransactionSlug } from "./makeTransactionSlug";

interface IExtractTransactionsFromCSVData {
  data: CSVData;
  bankAccountId: string;
}
interface RawTransaction {
  amount: string;
  date: string;
  description: string;
  idFromBank: string;
}
export const extractTransactionsFromCSVData = ({
  data,
  bankAccountId,
}: IExtractTransactionsFromCSVData) => {
  const headersSettings = [
    {
      expected: "Identificador",
      parsed: "idFromBank",
    },
    {
      expected: "Data",
      parsed: "date",
    },
    {
      expected: "Valor",
      parsed: "amount",
    },
    {
      expected: "Descrição",
      parsed: "description",
    },
    {
      expected: "Data",
      parsed: "date",
    },
  ];
  let error = null;

  const headers: string[] = data.shift() as string[];
  const isValid = headersSettings.every((item) =>
    headers.includes(item.expected)
  );

  if (!isValid) {
    error = {
      message: "CSV is not valid",
    };
    return {
      data: null,
      error,
      done: false,
    };
  }

  const rawTransactions: RawTransaction[] = data.reduce((acc, entry) => {
    const transaction: RawTransaction = {} as RawTransaction;
    headers.forEach((key, index) => {
      const parsedKey = headersSettings.find((item) => item.expected == key)
        ?.parsed as keyof RawTransaction;
      if (parsedKey) transaction[parsedKey] = entry[index];
    });
    if (transaction.amount && transaction.date) {
      acc.push(transaction);
    }
    return acc;
  }, [] as RawTransaction[]);

  const parsedTransactions: CreateTransaction[] = parseTransactions(
    rawTransactions,
    bankAccountId
  );

  return {
    data: parsedTransactions,
    error: null,
    done: true,
  };
};

const parseTransactions = (
  rawTransactions: RawTransaction[],
  bankAccountId: string
) => {
  return rawTransactions.reduce((acc, item) => {
    try {
      const type =
        Number(item.amount) > 0
          ? TransactionType.credit
          : TransactionType.debit;
      const amount = currency(item.amount).value;
      const dateAsLocaleString = item["date"];
      const dateObject = parse(dateAsLocaleString, "P", new Date(), {
        locale: ptBR,
      });
      const dateIso = dateObject.toISOString();
      const description = item["description"] || "";
      const creditor = (description.split("-")[1] || "").trim();
      const idFromBank = item["idFromBank"];
      const transaction: CreateTransaction = {
        idFromBank: idFromBank,
        bankAccountId: bankAccountId,
        amount: amount,
        type: type,
        date: dateIso,
        creditor: creditor,
        description: description,
        slug: makeTransactionSlug({
          date: dateIso,
          amount: amount.toString(),
          idFromBank,
          creditor: creditor,
        }),
      };
      const validation = createTransactionSchema.safeParse(transaction);
      if (validation.success) {
        acc.push(transaction);
      } else {
        console.log(
          "Validation Error, transaction skipped -->",
          transaction,
          validation.error
        );
      }

      return acc;
    } catch (e) {
      console.log("parsedTransactions catch error, item -->", e, item);
      return acc;
    }
  }, [] as CreateTransaction[]);
};

