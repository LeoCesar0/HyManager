import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
    uri: process.env.HYGRAPH_API_URL,
    headers:{
        'Authorization': `Bearer ${process.env.HYGRAPH_API_TOKEN}`
    },
    cache: new InMemoryCache()
})