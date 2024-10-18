import React from 'react'
import LiveDiv from '../../ui/LiveDiv'
import LoadingImage from '../../ui/LoadingImage'
import {
  Profile,
  SessionType,
  useFollow,
  useSession
} from '@lens-protocol/react-web'
import { defaultSponsored } from '../../../utils/config'
import formatHandle from '../../../utils/lib/formatHandle'
import toast from 'react-hot-toast'
import getAvatar from '../../../utils/lib/getAvatar'
import LoadingButton from '@mui/lab/LoadingButton'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Link from 'next/link'
import VerifiedBadge from '../../ui/VerifiedBadge'
const SingleHorizontalStreamerDiv = ({
  profile,
  premium,
  live = false
}: {
  profile: Profile
  live?: boolean
  premium?: boolean
}) => {
  const { data } = useSession()

  const { execute, loading: followLoading } = useFollow()

  const handleFollow = async (profile: Profile) => {
    try {
      if (data?.type !== SessionType.WithProfile) return
      const result = await execute({
        profile: profile,
        sponsored: defaultSponsored
      })

      if (result.isSuccess()) {
        toast.success(`Following ${formatHandle(profile)}`)
      } else if (result.isFailure()) {
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
        <Link href={`/${formatHandle(profile)}`}>
          <LoadingImage
            src={getAvatar(profile)}
            className="w-14 h-14 rounded-full"
          />
        </Link>
        {live && (
          <div className="-mt-4 absolute bottom-0 z-40">
            <LiveDiv />
          </div>
        )}
        {!live &&
          data?.type === SessionType.WithProfile &&
          !profile?.operations?.isFollowedByMe?.value && (
            <div className="-mt-4 absolute bottom-0 z-40">
              <LoadingButton
                startIcon={
                  <PersonAddIcon
                    fontSize="inherit"
                    sx={{
                      width: '10px',
                      height: '10px'
                    }}
                    className="-mr-1"
                  />
                }
                onClick={() => {
                  handleFollow(profile)
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
        <div className="text-s-text text-xs">{formatHandle(profile)}</div>
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
