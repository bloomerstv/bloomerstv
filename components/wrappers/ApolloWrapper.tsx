import React from 'react'
import { NODE_GRAPHQL_URL } from '../../utils/config'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import { getAccessToken } from '../../utils/lib/getAccessTokenAsync'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: NODE_GRAPHQL_URL
})

const authLink = setContext(async () => {
  const token = await getAccessToken()

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
