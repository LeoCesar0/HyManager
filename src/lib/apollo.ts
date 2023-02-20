import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_HYGRAPH_API_URL,
    headers:{
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_API_USER_TOKEN}`
    },
    cache: new InMemoryCache()
})