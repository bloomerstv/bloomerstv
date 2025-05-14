'use client'
import React, { useCallback } from 'react'
import StreamerBar from './StreamerSidebar/StreamerBar'
import Link from 'next/link'
import { DISCORD_INVITE_URL, GITHUB_URL, X_URL } from '../../utils/config'

import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import {
  useIsVerifiedQuery,
  useOfflineStreamersQuery
} from '../../graphql/generated'
import useIsMobile from '../../utils/hooks/useIsMobile'
import StreamerBarLoading from './StreamerSidebar/StreamerBarLoading'
import AppLinksRow from './AppLinksRow'
import useSession from '../../utils/hooks/useSession'
import { Account, useAccountsBulk } from '@lens-protocol/react'
import { useStreamersWithAccounts } from '../store/useStreamersWithAccounts'
import SubscribeToSuperBloomers from './SubscribeToSuperBloomers'

const StreamerSidebar = () => {
  const { isAuthenticated, account } = useSession()
  const pathname = usePathname()
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const streamersWithAccounts = useStreamersWithAccounts(
    (state) => state.streamersWithAccounts
  )

  const { data: offlineStreamers, loading } = useOfflineStreamersQuery()

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      accountAddresses: [account?.address]
    },
    skip: !account?.address
  })

  // Assuming offlineStreamers is already fetched and available
  const sortedOfflineStreamers = React.useMemo(() => {
    if (!offlineStreamers?.offlineStreamers) return []
    const now = new Date()

    // Separate streamers based on nextStreamTime criteria
    const withNextStream =
      offlineStreamers?.offlineStreamers.filter(
        (streamer) =>
          streamer?.nextStreamTime && new Date(streamer.nextStreamTime) > now
      ) || []
    const others =
      offlineStreamers?.offlineStreamers.filter(
        (streamer) =>
          !streamer?.nextStreamTime || new Date(streamer.nextStreamTime) <= now
      ) || []

    // Sort each group
    const sortedWithNextStream = withNextStream.sort(
      (a, b) =>
        new Date(b?.nextStreamTime).getTime() -
        new Date(a?.nextStreamTime).getTime()
    )
    const sortedOthers = others.sort(
      (a, b) =>
        new Date(b?.lastSeen).getTime() - new Date(a?.lastSeen).getTime()
    )

    // Concatenate the sorted groups
    return [...sortedWithNextStream, ...sortedOthers]
  }, [offlineStreamers?.offlineStreamers])

  const offlineStreamersMap = React.useMemo(() => {
    if (!sortedOfflineStreamers) return new Map()
    const map = new Map()
    sortedOfflineStreamers?.forEach((streamer) => {
      if (!streamer) return

      if (map.get(streamer.accountAddress)) return

      map.set(streamer.accountAddress, {
        lastSeen: streamer?.lastSeen,
        premium: streamer?.premium,
        nextStreamTime: streamer?.nextStreamTime
      })
    })
    return map
  }, [sortedOfflineStreamers])

  const { data: offlineAccounts, loading: offlineAccountsLoading } =
    useAccountsBulk({
      addresses:
        sortedOfflineStreamers?.map((streamer) => streamer?.accountAddress) ??
        []
    })

  const followingStreamers = streamersWithAccounts?.filter((streamer) => {
    return streamer?.account?.operations?.isFollowedByMe
  })

  const restOfTheStreamers = streamersWithAccounts?.filter((streamer) => {
    return !streamer?.account?.operations?.isFollowedByMe
  })

  const getOfflineFollowingStreamers = useCallback((): Account[] => {
    // get following profiles from public replays
    const offlineFollowingStreamers = offlineAccounts?.filter(
      (offlineAccount) => {
        // Check if this account is already in streamersWithAccounts
        const alreadyInStreamers = streamersWithAccounts?.some(
          (streamer) => streamer?.accountAddress === offlineAccount?.address
        )

        return (
          !alreadyInStreamers &&
          offlineAccount?.operations?.isFollowedByMe &&
          (!isAuthenticated || offlineAccount?.address !== account?.address)
        )
      }
    )

    return offlineFollowingStreamers || []
  }, [
    offlineAccounts,
    isAuthenticated,
    account?.address,
    streamersWithAccounts
  ])

  const getOfflineRecommendedStreamers = useCallback((): Account[] => {
    // get following profiles from public replays
    const offlineRecommendedStreamers = offlineAccounts?.filter(
      (offlineAccount) => {
        // Check if this account is already in streamersWithAccounts
        const alreadyInStreamers = streamersWithAccounts?.some(
          (streamer) => streamer?.accountAddress === offlineAccount?.address
        )

        return (
          !alreadyInStreamers &&
          !offlineAccount?.operations?.isFollowedByMe &&
          (!isAuthenticated || offlineAccount?.address !== account?.address)
        )
      }
    )

    return offlineRecommendedStreamers || []
  }, [
    offlineAccounts,
    isAuthenticated,
    account?.address,
    streamersWithAccounts
  ])

  const offlineFollowingStreamers = getOfflineFollowingStreamers()
  const offlineRecommendedStreamers = getOfflineRecommendedStreamers()

  const minimize = !isMobile && pathname !== '/'

  return (
    <div
      className={clsx(
        'h-full bg-s-bg overflow-auto no-scrollbar',
        !minimize ? 'sm:min-w-[250px] sm:py-2 pb-4' : 'py-2',
        isMobile && 'px-1'
      )}
    >
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col w-full h-full overflow-y-auto no-scrollbar">
          {minimize && !isMobile && (
            <div className="px-2 2xl:px-2.5">
              <div className="w-10 h-0.5" />
            </div>
          )}
          {isAuthenticated && (
            <>
              {!minimize && (
                <div className="font-bold px-4 sm:py-2">Following Channels</div>
              )}
              {(loading || offlineAccountsLoading) && (
                <div className="flex flex-col w-full">
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                </div>
              )}
              {Boolean(followingStreamers?.length) ||
              Boolean(offlineFollowingStreamers?.length) ? (
                <div className="flex flex-col w-full">
                  {followingStreamers?.map((streamer) => {
                    return (
                      <StreamerBar
                        key={streamer?.accountAddress}
                        streamer={streamer}
                      />
                    )
                  })}

                  {offlineFollowingStreamers?.slice(0, 10)?.map((account) => {
                    return (
                      // @ts-ignore
                      <StreamerBar
                        key={account?.address}
                        streamer={{
                          account,
                          accountAddress: account?.address,
                          lastSeen: offlineStreamersMap.get(account?.address)
                            ?.lastSeen,
                          nextStreamTime: offlineStreamersMap.get(
                            account?.address
                          )?.nextStreamTime,
                          premium:
                            offlineStreamersMap.get(account?.address)
                              ?.premium ?? false
                        }}
                      />
                    )
                  })}
                </div>
              ) : (
                <>
                  {!minimize && !(loading || offlineAccountsLoading) && (
                    <div className="px-4 py-2 text-sm text-s-text font-semibold">
                      No one from your followings has been streaming recently.
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <>
            {!minimize &&
              (loading ||
                offlineAccountsLoading ||
                restOfTheStreamers?.length > 0 ||
                offlineRecommendedStreamers.length > 0) && (
                <div className="font-bold px-4 py-2">Recommended Channels</div>
              )}
            {(loading || offlineAccountsLoading) && (
              <div className="flex flex-col w-full">
                <StreamerBarLoading />
                <StreamerBarLoading />
                <StreamerBarLoading />
              </div>
            )}
            {(Boolean(restOfTheStreamers?.length) ||
              Boolean(offlineRecommendedStreamers?.length)) && (
              <div className="flex flex-col w-full">
                {restOfTheStreamers?.map((streamer) => {
                  return (
                    // @ts-ignore
                    <StreamerBar
                      key={streamer?.accountAddress}
                      streamer={streamer}
                    />
                  )
                })}

                {offlineRecommendedStreamers?.slice(0, 10)?.map((account) => {
                  return (
                    // @ts-ignore
                    <StreamerBar
                      key={account?.address}
                      streamer={{
                        account: account,
                        accountAddress: account?.address,
                        lastSeen: offlineStreamersMap.get(account?.address)
                          ?.lastSeen,
                        premium:
                          offlineStreamersMap.get(account?.address)?.premium ??
                          false,
                        nextStreamTime: offlineStreamersMap.get(
                          account?.address
                        )?.nextStreamTime
                      }}
                    />
                  )
                })}
              </div>
            )}
          </>
        </div>

        {/* subscribe to super bloomers */}

        {!isVerified?.isVerified?.[0]?.isVerified && (
          <SubscribeToSuperBloomers />
        )}

        {!isMobile && (
          <>
            {minimize ? (
              <div className="flex flex-col w-full ">
                <IconButton
                  sx={{
                    borderRadius: '0px'
                  }}
                  LinkComponent={Link}
                  href={X_URL}
                  target="_blank"
                >
                  <XIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  LinkComponent={Link}
                  href={GITHUB_URL}
                  target="_blank"
                  sx={{
                    borderRadius: '0px'
                  }}
                >
                  <GitHubIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  LinkComponent={Link}
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  sx={{
                    borderRadius: '0px'
                  }}
                >
                  <img
                    src={
                      theme === 'light'
                        ? '/icons/discord-icon.svg'
                        : '/icons/discord-icon-dark.svg'
                    }
                    alt="discord"
                    className="w-6 h-6"
                  />
                </IconButton>
              </div>
            ) : (
              <AppLinksRow />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StreamerSidebar
