'use client'
import React from 'react'
import { NODE_GRAPHQL_URL } from '../../utils/config'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Result, useSessionClient } from '@lens-protocol/react'
import useSession from '../../utils/hooks/useSession'
// import { useIdentityToken } from '@lens-protocol/react-web'

const httpLink = createHttpLink({
  uri: NODE_GRAPHQL_URL
})

const cache = new InMemoryCache()

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  // const identityToken = useIdentityToken()
  const { authenticatedUser } = useSession()
  console.log('authenticatedUser', authenticatedUser)

  const { data: sessionClient } = useSessionClient()
  const idToken = sessionClient?.getCredentials().match(
    (result) => result?.idToken,
    (error) => {
      throw error
    }
  )

  console.log('idToken', idToken)

  const authLink = setContext(async () => {
    return {
      headers: {
        Authorization: idToken ? `${idToken}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
