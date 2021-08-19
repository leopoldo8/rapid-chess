import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import merge from 'deepmerge'

let apolloClient: ApolloClient<InMemoryCache>;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: false,
    link: new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState: NormalizedCacheObject = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract() as NormalizedCacheObject;

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data as NormalizedCacheObject & InMemoryCache);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient as ApolloClient<InMemoryCache>;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
