import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import withData from "next-with-apollo";

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql",  credentials: 'include',
 });
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: true,
    sameOrigin: false,
});

export default client