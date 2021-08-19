import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/client'
import GlobalStyles from '../styles/global';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
