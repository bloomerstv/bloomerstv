import React from 'react'
import LiveDiv from '../../ui/LiveDiv'
import LoadingImage from '../../ui/LoadingImage'
import formatHandle from '../../../utils/lib/formatHandle'
import toast from 'react-hot-toast'
import getAvatar from '../../../utils/lib/getAvatar'
import LoadingButton from '@mui/lab/LoadingButton'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import VerifiedBadge from '../../ui/VerifiedBadge'
import { Account } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'
import useFollow from '../../../utils/hooks/lens/useFollow'
const SingleHorizontalStreamerDiv = ({
  account,
  premium,
  live = false
}: {
  account: Account
  live?: boolean
  premium?: boolean
}) => {
  const { isAuthenticated } = useSession()

  const { execute, loading: followLoading } = useFollow()

  const handleFollow = async (account: Account) => {
    try {
      if (isAuthenticated) return
      const result = await execute({
        account: account?.address
      })

      if (result.isOk() && result?.value?.__typename === 'FollowResponse') {
        toast.success(`Following ${formatHandle(account)}`)
      } else if (result.isErr()) {
        toast.error(result.error.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(String(e))
    }
  }
  return (
    <div className="centered-col">
      <div className="centered-col relative">
        <Link href={`/${formatHandle(account)}`}>
          <LoadingImage
            src={getAvatar(account)}
            className="w-14 h-14 rounded-full"
          />
        </Link>
        {live && (
          <div className="-mt-4 absolute bottom-0 z-40">
            <LiveDiv />
          </div>
        )}
        {!live && isAuthenticated && !account?.operations?.isFollowedByMe && (
          <div className="-mt-4 absolute bottom-0 z-40">
            <LoadingButton
              startIcon={
                <UserPlus
                  fontSize="inherit"
                  sx={{
                    width: '10px',
                    height: '10px'
                  }}
                  className="-mr-1"
                />
              }
              onClick={() => {
                handleFollow(account)
              }}
              loading={followLoading}
              variant="contained"
              size="small"
              color="secondary"
              fullWidth={false}
              sx={{
                borderRadius: '20px',
                padding: '3px 0px',
                width: '10px',
                textTransform: 'none',
                fontSize: '10px',
                fontWeight: 'bold'
              }}
            >
              Follow
            </LoadingButton>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-x-0.5">
        <div className="text-s-text text-xs">{formatHandle(account)}</div>
        {premium && (
          <VerifiedBadge
            sx={{
              width: '12px',
              height: '12px'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default SingleHorizontalStreamerDiv
