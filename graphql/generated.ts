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

export type Chat = {
  __typename?: 'Chat'
  avatarUrl?: Maybe<Scalars['String']['output']>
  content?: Maybe<Scalars['String']['output']>
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  handle?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['String']['output']>
  profileId?: Maybe<Scalars['String']['output']>
}

export type IpfsResult = {
  __typename?: 'IpfsResult'
  cid?: Maybe<Scalars['String']['output']>
  size?: Maybe<Scalars['Int']['output']>
}

export type Mutation = {
  __typename?: 'Mutation'
  createMyLensStreamSession?: Maybe<Scalars['Boolean']['output']>
  updateMyStream?: Maybe<Scalars['Boolean']['output']>
  uploadDataToIpfs?: Maybe<IpfsResult>
}

export type MutationCreateMyLensStreamSessionArgs = {
  publicationId: Scalars['String']['input']
}

export type MutationUpdateMyStreamArgs = {
  request: UpdateStreamRequest
}

export type MutationUploadDataToIpfsArgs = {
  data: Scalars['String']['input']
}

export type MyStream = Stream & {
  __typename?: 'MyStream'
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  latestStreamPublicationId?: Maybe<Scalars['String']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamDescription?: Maybe<Scalars['String']['output']>
  streamKey?: Maybe<Scalars['String']['output']>
  streamName?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  getMyRecordedStreamSessions?: Maybe<Array<Maybe<RecordedSession>>>
  liveStreamers?: Maybe<Array<Maybe<Streamer>>>
  myStream?: Maybe<MyStream>
  ping?: Maybe<Scalars['String']['output']>
  shouldCreateNewPost?: Maybe<Scalars['Boolean']['output']>
  streamChats?: Maybe<Array<Maybe<Chat>>>
  streamer?: Maybe<SingleStreamer>
}

export type QueryGetMyRecordedStreamSessionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>
}

export type QueryStreamChatsArgs = {
  profileId: Scalars['String']['input']
}

export type QueryStreamerArgs = {
  profileId: Scalars['String']['input']
}

export type RecordedSession = {
  __typename?: 'RecordedSession'
  mp4Url?: Maybe<Scalars['String']['output']>
  publicationId?: Maybe<Scalars['String']['output']>
  recordingUrl?: Maybe<Scalars['String']['output']>
  sourceSegmentsDuration?: Maybe<Scalars['Int']['output']>
}

export type SingleStreamer = Stream & {
  __typename?: 'SingleStreamer'
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  latestStreamPublicationId?: Maybe<Scalars['String']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamDescription?: Maybe<Scalars['String']['output']>
  streamName?: Maybe<Scalars['String']['output']>
  thumbnail?: Maybe<Scalars['String']['output']>
}

export type Stream = {
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamDescription?: Maybe<Scalars['String']['output']>
  streamName?: Maybe<Scalars['String']['output']>
}

export type Streamer = Stream & {
  __typename?: 'Streamer'
  createdAt?: Maybe<Scalars['BigNumber']['output']>
  isActive?: Maybe<Scalars['Boolean']['output']>
  lastSeen?: Maybe<Scalars['BigNumber']['output']>
  playbackId?: Maybe<Scalars['String']['output']>
  profileId: Scalars['String']['output']
  streamDescription?: Maybe<Scalars['String']['output']>
  streamName?: Maybe<Scalars['String']['output']>
  thumbnail?: Maybe<Scalars['String']['output']>
}

export type UpdateStreamRequest = {
  streamDescription?: InputMaybe<Scalars['String']['input']>
  streamName?: InputMaybe<Scalars['String']['input']>
}

export type CreateMyLensStreamSessionMutationVariables = Exact<{
  publicationId: Scalars['String']['input']
}>

export type CreateMyLensStreamSessionMutation = {
  __typename?: 'Mutation'
  createMyLensStreamSession?: boolean | null
}

export type GetMyRecordedStreamSessionsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>
}>

export type GetMyRecordedStreamSessionsQuery = {
  __typename?: 'Query'
  getMyRecordedStreamSessions?: Array<{
    __typename?: 'RecordedSession'
    publicationId?: string | null
    mp4Url?: string | null
    sourceSegmentsDuration?: number | null
    recordingUrl?: string | null
  } | null> | null
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
    createdAt?: any | null
    playbackId?: string | null
    thumbnail?: string | null
  } | null> | null
}

export type MyStreamQueryVariables = Exact<{ [key: string]: never }>

export type MyStreamQuery = {
  __typename?: 'Query'
  myStream?: {
    __typename?: 'MyStream'
    profileId: string
    streamName?: string | null
    lastSeen?: any | null
    playbackId?: string | null
    streamKey?: string | null
    isActive?: boolean | null
    latestStreamPublicationId?: string | null
  } | null
}

export type ShouldCreateNewPostQueryVariables = Exact<{ [key: string]: never }>

export type ShouldCreateNewPostQuery = {
  __typename?: 'Query'
  shouldCreateNewPost?: boolean | null
}

export type StreamChatsQueryVariables = Exact<{
  profileId: Scalars['String']['input']
}>

export type StreamChatsQuery = {
  __typename?: 'Query'
  streamChats?: Array<{
    __typename?: 'Chat'
    content?: string | null
    handle?: string | null
    avatarUrl?: string | null
    profileId?: string | null
    id?: string | null
    createdAt?: any | null
  } | null> | null
}

export type StreamerQueryVariables = Exact<{
  profileId: Scalars['String']['input']
}>

export type StreamerQuery = {
  __typename?: 'Query'
  streamer?: {
    __typename?: 'SingleStreamer'
    profileId: string
    lastSeen?: any | null
    isActive?: boolean | null
    createdAt?: any | null
    playbackId?: string | null
    streamName?: string | null
    latestStreamPublicationId?: string | null
  } | null
}

export type UpdateMyStreamMutationVariables = Exact<{
  request: UpdateStreamRequest
}>

export type UpdateMyStreamMutation = {
  __typename?: 'Mutation'
  updateMyStream?: boolean | null
}

export type UploadDataToIpfsMutationVariables = Exact<{
  data: Scalars['String']['input']
}>

export type UploadDataToIpfsMutation = {
  __typename?: 'Mutation'
  uploadDataToIpfs?: {
    __typename?: 'IpfsResult'
    cid?: string | null
    size?: number | null
  } | null
}

export const CreateMyLensStreamSessionDocument = gql`
  mutation CreateMyLensStreamSession($publicationId: String!) {
    createMyLensStreamSession(publicationId: $publicationId)
  }
`
export type CreateMyLensStreamSessionMutationFn = Apollo.MutationFunction<
  CreateMyLensStreamSessionMutation,
  CreateMyLensStreamSessionMutationVariables
>

/**
 * __useCreateMyLensStreamSessionMutation__
 *
 * To run a mutation, you first call `useCreateMyLensStreamSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMyLensStreamSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMyLensStreamSessionMutation, { data, loading, error }] = useCreateMyLensStreamSessionMutation({
 *   variables: {
 *      publicationId: // value for 'publicationId'
 *   },
 * });
 */
export function useCreateMyLensStreamSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMyLensStreamSessionMutation,
    CreateMyLensStreamSessionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateMyLensStreamSessionMutation,
    CreateMyLensStreamSessionMutationVariables
  >(CreateMyLensStreamSessionDocument, options)
}
export type CreateMyLensStreamSessionMutationHookResult = ReturnType<
  typeof useCreateMyLensStreamSessionMutation
>
export type CreateMyLensStreamSessionMutationResult =
  Apollo.MutationResult<CreateMyLensStreamSessionMutation>
export type CreateMyLensStreamSessionMutationOptions =
  Apollo.BaseMutationOptions<
    CreateMyLensStreamSessionMutation,
    CreateMyLensStreamSessionMutationVariables
  >
export const GetMyRecordedStreamSessionsDocument = gql`
  query GetMyRecordedStreamSessions($skip: Int) {
    getMyRecordedStreamSessions(skip: $skip) {
      publicationId
      mp4Url
      sourceSegmentsDuration
      recordingUrl
    }
  }
`

/**
 * __useGetMyRecordedStreamSessionsQuery__
 *
 * To run a query within a React component, call `useGetMyRecordedStreamSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyRecordedStreamSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyRecordedStreamSessionsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetMyRecordedStreamSessionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMyRecordedStreamSessionsQuery,
    GetMyRecordedStreamSessionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    GetMyRecordedStreamSessionsQuery,
    GetMyRecordedStreamSessionsQueryVariables
  >(GetMyRecordedStreamSessionsDocument, options)
}
export function useGetMyRecordedStreamSessionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMyRecordedStreamSessionsQuery,
    GetMyRecordedStreamSessionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetMyRecordedStreamSessionsQuery,
    GetMyRecordedStreamSessionsQueryVariables
  >(GetMyRecordedStreamSessionsDocument, options)
}
export function useGetMyRecordedStreamSessionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetMyRecordedStreamSessionsQuery,
    GetMyRecordedStreamSessionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    GetMyRecordedStreamSessionsQuery,
    GetMyRecordedStreamSessionsQueryVariables
  >(GetMyRecordedStreamSessionsDocument, options)
}
export type GetMyRecordedStreamSessionsQueryHookResult = ReturnType<
  typeof useGetMyRecordedStreamSessionsQuery
>
export type GetMyRecordedStreamSessionsLazyQueryHookResult = ReturnType<
  typeof useGetMyRecordedStreamSessionsLazyQuery
>
export type GetMyRecordedStreamSessionsSuspenseQueryHookResult = ReturnType<
  typeof useGetMyRecordedStreamSessionsSuspenseQuery
>
export type GetMyRecordedStreamSessionsQueryResult = Apollo.QueryResult<
  GetMyRecordedStreamSessionsQuery,
  GetMyRecordedStreamSessionsQueryVariables
>
export const LiveStreamersDocument = gql`
  query LiveStreamers {
    liveStreamers {
      profileId
      streamName
      lastSeen
      isActive
      createdAt
      playbackId
      thumbnail
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
      lastSeen
      playbackId
      streamKey
      isActive
      latestStreamPublicationId
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
export const ShouldCreateNewPostDocument = gql`
  query ShouldCreateNewPost {
    shouldCreateNewPost
  }
`

/**
 * __useShouldCreateNewPostQuery__
 *
 * To run a query within a React component, call `useShouldCreateNewPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useShouldCreateNewPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShouldCreateNewPostQuery({
 *   variables: {
 *   },
 * });
 */
export function useShouldCreateNewPostQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ShouldCreateNewPostQuery,
    ShouldCreateNewPostQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    ShouldCreateNewPostQuery,
    ShouldCreateNewPostQueryVariables
  >(ShouldCreateNewPostDocument, options)
}
export function useShouldCreateNewPostLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ShouldCreateNewPostQuery,
    ShouldCreateNewPostQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    ShouldCreateNewPostQuery,
    ShouldCreateNewPostQueryVariables
  >(ShouldCreateNewPostDocument, options)
}
export function useShouldCreateNewPostSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ShouldCreateNewPostQuery,
    ShouldCreateNewPostQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    ShouldCreateNewPostQuery,
    ShouldCreateNewPostQueryVariables
  >(ShouldCreateNewPostDocument, options)
}
export type ShouldCreateNewPostQueryHookResult = ReturnType<
  typeof useShouldCreateNewPostQuery
>
export type ShouldCreateNewPostLazyQueryHookResult = ReturnType<
  typeof useShouldCreateNewPostLazyQuery
>
export type ShouldCreateNewPostSuspenseQueryHookResult = ReturnType<
  typeof useShouldCreateNewPostSuspenseQuery
>
export type ShouldCreateNewPostQueryResult = Apollo.QueryResult<
  ShouldCreateNewPostQuery,
  ShouldCreateNewPostQueryVariables
>
export const StreamChatsDocument = gql`
  query StreamChats($profileId: String!) {
    streamChats(profileId: $profileId) {
      content
      handle
      avatarUrl
      profileId
      id
      createdAt
    }
  }
`

/**
 * __useStreamChatsQuery__
 *
 * To run a query within a React component, call `useStreamChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStreamChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamChatsQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useStreamChatsQuery(
  baseOptions: Apollo.QueryHookOptions<
    StreamChatsQuery,
    StreamChatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StreamChatsQuery, StreamChatsQueryVariables>(
    StreamChatsDocument,
    options
  )
}
export function useStreamChatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StreamChatsQuery,
    StreamChatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<StreamChatsQuery, StreamChatsQueryVariables>(
    StreamChatsDocument,
    options
  )
}
export function useStreamChatsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    StreamChatsQuery,
    StreamChatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<StreamChatsQuery, StreamChatsQueryVariables>(
    StreamChatsDocument,
    options
  )
}
export type StreamChatsQueryHookResult = ReturnType<typeof useStreamChatsQuery>
export type StreamChatsLazyQueryHookResult = ReturnType<
  typeof useStreamChatsLazyQuery
>
export type StreamChatsSuspenseQueryHookResult = ReturnType<
  typeof useStreamChatsSuspenseQuery
>
export type StreamChatsQueryResult = Apollo.QueryResult<
  StreamChatsQuery,
  StreamChatsQueryVariables
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
      latestStreamPublicationId
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
export const UploadDataToIpfsDocument = gql`
  mutation UploadDataToIpfs($data: String!) {
    uploadDataToIpfs(data: $data) {
      cid
      size
    }
  }
`
export type UploadDataToIpfsMutationFn = Apollo.MutationFunction<
  UploadDataToIpfsMutation,
  UploadDataToIpfsMutationVariables
>

/**
 * __useUploadDataToIpfsMutation__
 *
 * To run a mutation, you first call `useUploadDataToIpfsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadDataToIpfsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadDataToIpfsMutation, { data, loading, error }] = useUploadDataToIpfsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUploadDataToIpfsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadDataToIpfsMutation,
    UploadDataToIpfsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UploadDataToIpfsMutation,
    UploadDataToIpfsMutationVariables
  >(UploadDataToIpfsDocument, options)
}
export type UploadDataToIpfsMutationHookResult = ReturnType<
  typeof useUploadDataToIpfsMutation
>
export type UploadDataToIpfsMutationResult =
  Apollo.MutationResult<UploadDataToIpfsMutation>
export type UploadDataToIpfsMutationOptions = Apollo.BaseMutationOptions<
  UploadDataToIpfsMutation,
  UploadDataToIpfsMutationVariables
>

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Stream: ['MyStream', 'SingleStreamer', 'Streamer']
  }
}
export default result
