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

export type Mutation = {
  __typename?: 'Mutation'
  updateMyStream?: Maybe<Scalars['Boolean']['output']>
}

export type MutationUpdateMyStreamArgs = {
  request: UpdateStreamRequest
}

export type MyStream = {
  __typename?: 'MyStream'
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamDescription?: Maybe<Scalars['String']['output']>
  streamKey?: Maybe<Scalars['String']['output']>
  streamName?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  liveStreamers?: Maybe<Array<Maybe<Streamer>>>
  myStream?: Maybe<MyStream>
  ping?: Maybe<Scalars['String']['output']>
  streamer?: Maybe<Streamer>
}

export type QueryStreamerArgs = {
  profileId: Scalars['String']['input']
}

export type Streamer = {
  __typename?: 'Streamer'
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamDescription?: Maybe<Scalars['String']['output']>
  streamName?: Maybe<Scalars['String']['output']>
}

export type UpdateStreamRequest = {
  streamDescription?: InputMaybe<Scalars['String']['input']>
  streamName?: InputMaybe<Scalars['String']['input']>
}

export type LiveStreamersQueryVariables = Exact<{ [key: string]: never }>

export type LiveStreamersQuery = {
  __typename?: 'Query'
  liveStreamers?: Array<{
    __typename?: 'Streamer'
    profileId: string
    streamName?: string | null
    streamDescription?: string | null
    lastSeen?: any | null
    isActive?: boolean | null
    createdAt?: any | null
    playbackId?: string | null
  } | null> | null
}

export type MyStreamQueryVariables = Exact<{ [key: string]: never }>

export type MyStreamQuery = {
  __typename?: 'Query'
  myStream?: {
    __typename?: 'MyStream'
    profileId: string
    streamName?: string | null
    streamDescription?: string | null
    lastSeen?: any | null
    playbackId?: string | null
    streamKey?: string | null
  } | null
}

export type StreamerQueryVariables = Exact<{
  profileId: Scalars['String']['input']
}>

export type StreamerQuery = {
  __typename?: 'Query'
  streamer?: {
    __typename?: 'Streamer'
    profileId: string
    lastSeen?: any | null
    isActive?: boolean | null
    createdAt?: any | null
    playbackId?: string | null
    streamName?: string | null
    streamDescription?: string | null
  } | null
}

export type UpdateMyStreamMutationVariables = Exact<{
  request: UpdateStreamRequest
}>

export type UpdateMyStreamMutation = {
  __typename?: 'Mutation'
  updateMyStream?: boolean | null
}

export const LiveStreamersDocument = gql`
  query LiveStreamers {
    liveStreamers {
      profileId
      streamName
      streamDescription
      lastSeen
      isActive
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
export const MyStreamDocument = gql`
  query MyStream {
    myStream {
      profileId
      streamName
      streamDescription
      lastSeen
      playbackId
      streamKey
    }
  }
`

/**
 * __useMyStreamQuery__
 *
 * To run a query within a React component, call `useMyStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyStreamQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyStreamQuery(
  baseOptions?: Apollo.QueryHookOptions<MyStreamQuery, MyStreamQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyStreamQuery, MyStreamQueryVariables>(
    MyStreamDocument,
    options
  )
}
export function useMyStreamLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyStreamQuery,
    MyStreamQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyStreamQuery, MyStreamQueryVariables>(
    MyStreamDocument,
    options
  )
}
export function useMyStreamSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    MyStreamQuery,
    MyStreamQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyStreamQuery, MyStreamQueryVariables>(
    MyStreamDocument,
    options
  )
}
export type MyStreamQueryHookResult = ReturnType<typeof useMyStreamQuery>
export type MyStreamLazyQueryHookResult = ReturnType<
  typeof useMyStreamLazyQuery
>
export type MyStreamSuspenseQueryHookResult = ReturnType<
  typeof useMyStreamSuspenseQuery
>
export type MyStreamQueryResult = Apollo.QueryResult<
  MyStreamQuery,
  MyStreamQueryVariables
>
export const StreamerDocument = gql`
  query Streamer($profileId: String!) {
    streamer(profileId: $profileId) {
      profileId
      lastSeen
      isActive
      createdAt
      playbackId
      streamName
      streamDescription
    }
  }
`

/**
 * __useStreamerQuery__
 *
 * To run a query within a React component, call `useStreamerQuery` and pass it any options that fit your needs.
 * When your component renders, `useStreamerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamerQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useStreamerQuery(
  baseOptions: Apollo.QueryHookOptions<StreamerQuery, StreamerQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StreamerQuery, StreamerQueryVariables>(
    StreamerDocument,
    options
  )
}
export function useStreamerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StreamerQuery,
    StreamerQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<StreamerQuery, StreamerQueryVariables>(
    StreamerDocument,
    options
  )
}
export function useStreamerSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    StreamerQuery,
    StreamerQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<StreamerQuery, StreamerQueryVariables>(
    StreamerDocument,
    options
  )
}
export type StreamerQueryHookResult = ReturnType<typeof useStreamerQuery>
export type StreamerLazyQueryHookResult = ReturnType<
  typeof useStreamerLazyQuery
>
export type StreamerSuspenseQueryHookResult = ReturnType<
  typeof useStreamerSuspenseQuery
>
export type StreamerQueryResult = Apollo.QueryResult<
  StreamerQuery,
  StreamerQueryVariables
>
export const UpdateMyStreamDocument = gql`
  mutation UpdateMyStream($request: UpdateStreamRequest!) {
    updateMyStream(request: $request)
  }
`
export type UpdateMyStreamMutationFn = Apollo.MutationFunction<
  UpdateMyStreamMutation,
  UpdateMyStreamMutationVariables
>

/**
 * __useUpdateMyStreamMutation__
 *
 * To run a mutation, you first call `useUpdateMyStreamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyStreamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMyStreamMutation, { data, loading, error }] = useUpdateMyStreamMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUpdateMyStreamMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateMyStreamMutation,
    UpdateMyStreamMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateMyStreamMutation,
    UpdateMyStreamMutationVariables
  >(UpdateMyStreamDocument, options)
}
export type UpdateMyStreamMutationHookResult = ReturnType<
  typeof useUpdateMyStreamMutation
>
export type UpdateMyStreamMutationResult =
  Apollo.MutationResult<UpdateMyStreamMutation>
export type UpdateMyStreamMutationOptions = Apollo.BaseMutationOptions<
  UpdateMyStreamMutation,
  UpdateMyStreamMutationVariables
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
