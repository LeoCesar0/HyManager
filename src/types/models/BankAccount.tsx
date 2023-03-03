import { GetAllBankAccountsQuery } from "../../graphql/generated";


export type BankAccount = GetAllBankAccountsQuery['bankAccounts'][number]
