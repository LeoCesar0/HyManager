import {
  CreateTransactionMutationVariables,
  TransactionType,
} from "@graphql-folder/generated";
import { createTransactionSchema } from "@types-folder/models/Transaction";
import { parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { makeTransactionSlug, parseAmount } from "src/utils/app";
import { z } from "zod";

interface IImportTransactionsFromDoc {
  data: Array<any>;
  bankAccountId: string;
}
interface RawTransaction {
  amount: string;
  date: string;
  description: string;
  idFromBankTransaction: string;
}
export const importTransactionsFromDoc = ({
  data,
  bankAccountId,
}: IImportTransactionsFromDoc) => {
  const headersSettings = [
    {
      expected: "Identificador",
      parsed: "idFromBankTransaction",
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
      message: "Doc is not valid",
    };
    return {
      data: null,
      error,
      done: false,
    };
  }

  const rawTransactions: RawTransaction[] = data.reduce((acc, entry) => {
    const transaction: { [key: string]: string } = {};
    headers.forEach((key, index) => {
      const parsedKey = headersSettings.find(
        (item) => item.expected == key
      )?.parsed;
      if (parsedKey) transaction[parsedKey] = entry[index];
    });
    acc.push(transaction);
    return acc;
  }, [] as RawTransaction[]);

  const itemsRemove = [];

  console.log("rawTransactions -->", rawTransactions);

  const parsedTransactions: CreateTransactionMutationVariables[] =
    rawTransactions.reduce((acc, item) => {
      try {
        const amount = parseAmount(parseFloat(item["amount"]));
        const type =
          Number(item["amount"]) > 0
            ? TransactionType.Credit
            : TransactionType.Debit;
        const dateAsLocaleString = item["date"];
        const date = parse(dateAsLocaleString, "P", new Date(), {
          locale: ptBR,
        });
        const description = item["description"] || "";
        const creditor = (description.split("-")[1] || "").trim();
        const transaction: CreateTransactionMutationVariables = {
          idFromBankTransaction: item["idFromBankTransaction"],
          bankAccountId: bankAccountId,
          amount: amount,
          type: type,
          date: date,
          creditor: creditor,
          description: description,
          slug: makeTransactionSlug({
            date: date.toISOString(),
            amount: amount.toString(),
          }),
        };
        const validation = createTransactionSchema.safeParse(transaction);
        if (validation.success) {
          acc.push(transaction);
        } else {
          itemsRemove.push(item);
          console.log("Validation Error, transaction -->", transaction);
          console.log("validation -->", validation.error);
        }

        return acc;
      } catch (e) {
        itemsRemove.push(item);
        console.log("parsedTransactions catch error, item -->", e, item);
        return acc;
      }
    }, [] as CreateTransactionMutationVariables[]);

  return {
    data: parsedTransactions,
    error: null,
    done: true,
  };
};
