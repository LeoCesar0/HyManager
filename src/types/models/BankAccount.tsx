import { GetUserBankAccountsQuery } from "../../graphql/generated";


export type BankAccount = GetUserBankAccountsQuery['bankAccounts'][number]
