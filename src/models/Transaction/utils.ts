import {
  CreateTransactionMutationVariables,
  TransactionType,
} from "@graphql-folder/generated";
import { CSVData } from "@types-folder/index";
import { createTransactionSchema } from "@types-folder/models/Transaction";
import { parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { makeTransactionSlug, parseAmount } from "src/utils/app";

interface IExtractTransactionsFromCSVData {
  data: CSVData;
  bankAccountId: string;
}
interface RawTransaction {
  amount: string;
  date: string;
  description: string;
  idFromBankTransaction: string;
}
export const extractTransactionsFromCSVData = ({
  data,
  bankAccountId,
}: IExtractTransactionsFromCSVData) => {
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

  const parsedTransactions: CreateTransactionMutationVariables[] =
    parseTransactions(rawTransactions, bankAccountId);

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
      const amount = parseAmount(parseFloat(item["amount"]));
      const type =
        Number(item["amount"]) > 0
          ? TransactionType.Credit
          : TransactionType.Debit;
      const dateAsLocaleString = item["date"];
      const dateObject = parse(dateAsLocaleString, "P", new Date(), {
        locale: ptBR,
      });
      const dateIso = dateObject.toISOString();
      const description = item["description"] || "";
      const creditor = (description.split("-")[1] || "").trim();
      const idFromBankTransaction = item["idFromBankTransaction"];
      const transaction: CreateTransactionMutationVariables = {
        idFromBankTransaction: idFromBankTransaction,
        bankAccountId: bankAccountId,
        amount: amount,
        type: type,
        date: dateIso,
        creditor: creditor,
        description: description,
        slug: makeTransactionSlug({
          date: dateIso,
          amount: amount.toString(),
          idFromBankTransaction,
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
  }, [] as CreateTransactionMutationVariables[]);
};
