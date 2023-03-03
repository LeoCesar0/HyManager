import { GetAllBankAccountsQuery, GetAppUserByUIdQuery } from "../../graphql/generated";


export type CurrentUser = NonNullable<GetAppUserByUIdQuery['appUser']>