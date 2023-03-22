import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
// Log any GraphQL errors or network error that occurred
const errorLink = onError(
  ({ graphQLErrors, networkError, forward, operation }) => {
    console.group("Global On Error");
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
    console.groupEnd();
    return forward(operation);
  }
);

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HYGRAPH_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_API_USER_TOKEN}`,
  },
});

export const apolloClient = new ApolloClient({
  //   uri: process.env.NEXT_PUBLIC_HYGRAPH_API_URL,
  //   headers: {
  //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_API_USER_TOKEN}`,
  //   },
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
});
