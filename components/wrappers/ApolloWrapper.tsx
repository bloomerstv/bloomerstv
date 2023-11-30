import React, { useEffect, useMemo, useState } from 'react'
import { NODE_GRAPHQL_URL } from '../../utils/config'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAccessToken } from '@lens-protocol/react-web'

const httpLink = createHttpLink({
  uri: NODE_GRAPHQL_URL
})

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  const [refresh, setRefresh] = useState(0)
  const token = useAccessToken()

  useEffect(() => {
    if (!token) {
      setRefresh(refresh + 1)
    }
  }, [refresh])
  const client = useMemo(() => {
    const authLink = setContext((_, { headers }) => {
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    })

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    })
  }, [token])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
