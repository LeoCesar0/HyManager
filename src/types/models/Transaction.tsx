import { GetTransactionsByBankQuery } from "../../graphql/generated";


export type Transaction = GetTransactionsByBankQuery['transactions'][number]
