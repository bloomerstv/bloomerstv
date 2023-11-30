import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  BigNumber: { input: any; output: any }
}

export type Query = {
  __typename?: 'Query'
  liveStreamers?: Maybe<Array<Maybe<Streamer>>>
  streamId: Scalars['String']['output']
  streamer?: Maybe<Streamer>
}

export type QueryStreamerArgs = {
  profileId: Scalars['String']['input']
}

export type Streamer = {
  __typename?: 'Streamer'
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  isHealthy?: Maybe<Scalars['Boolean']['output']>
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamName?: Maybe<Scalars['String']['output']>
}

export type LiveStreamersQueryVariables = Exact<{ [key: string]: never }>

export type LiveStreamersQuery = {
  __typename?: 'Query'
  liveStreamers?: Array<{
    __typename?: 'Streamer'
    profileId: string
    streamName?: string | null
    lastSeen?: any | null
    isActive?: boolean | null
    isHealthy?: boolean | null
    createdAt?: any | null
    playbackId?: string | null
  } | null> | null
}

export type StreamIdQueryVariables = Exact<{ [key: string]: never }>

export type StreamIdQuery = { __typename?: 'Query'; streamId: string }

export const LiveStreamersDocument = gql`
  query LiveStreamers {
    liveStreamers {
      profileId
      streamName
      lastSeen
      isActive
      isHealthy
      createdAt
      playbackId
    }
  }
`

/**
 * __useLiveStreamersQuery__
 *
 * To run a query within a React component, call `useLiveStreamersQuery` and pass it any options that fit your needs.
 * When your component renders, `useLiveStreamersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiveStreamersQuery({
 *   variables: {
 *   },
 * });
 */
export function useLiveStreamersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LiveStreamersQuery,
    LiveStreamersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LiveStreamersQuery, LiveStreamersQueryVariables>(
    LiveStreamersDocument,
    options
  )
}
export function useLiveStreamersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LiveStreamersQuery,
    LiveStreamersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LiveStreamersQuery, LiveStreamersQueryVariables>(
    LiveStreamersDocument,
    options
  )
}
export function useLiveStreamersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    LiveStreamersQuery,
    LiveStreamersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    LiveStreamersQuery,
    LiveStreamersQueryVariables
  >(LiveStreamersDocument, options)
}
export type LiveStreamersQueryHookResult = ReturnType<
  typeof useLiveStreamersQuery
>
export type LiveStreamersLazyQueryHookResult = ReturnType<
  typeof useLiveStreamersLazyQuery
>
export type LiveStreamersSuspenseQueryHookResult = ReturnType<
  typeof useLiveStreamersSuspenseQuery
>
export type LiveStreamersQueryResult = Apollo.QueryResult<
  LiveStreamersQuery,
  LiveStreamersQueryVariables
>
export const StreamIdDocument = gql`
  query StreamId {
    streamId
  }
`

/**
 * __useStreamIdQuery__
 *
 * To run a query within a React component, call `useStreamIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useStreamIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useStreamIdQuery(
  baseOptions?: Apollo.QueryHookOptions<StreamIdQuery, StreamIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StreamIdQuery, StreamIdQueryVariables>(
    StreamIdDocument,
    options
  )
}
export function useStreamIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StreamIdQuery,
    StreamIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<StreamIdQuery, StreamIdQueryVariables>(
    StreamIdDocument,
    options
  )
}
export function useStreamIdSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    StreamIdQuery,
    StreamIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<StreamIdQuery, StreamIdQueryVariables>(
    StreamIdDocument,
    options
  )
}
export type StreamIdQueryHookResult = ReturnType<typeof useStreamIdQuery>
export type StreamIdLazyQueryHookResult = ReturnType<
  typeof useStreamIdLazyQuery
>
export type StreamIdSuspenseQueryHookResult = ReturnType<
  typeof useStreamIdSuspenseQuery
>
export type StreamIdQueryResult = Apollo.QueryResult<
  StreamIdQuery,
  StreamIdQueryVariables
>

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {}
}
export default result
