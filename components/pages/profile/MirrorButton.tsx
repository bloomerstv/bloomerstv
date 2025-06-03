import { Button, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Repeat } from 'lucide-react'

import { useModal } from '../../common/ModalContext'
import clsx from 'clsx'
import { AnimatedCounter } from 'react-animated-counter'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
import { AnyPost } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'
import useRepost from '../../../utils/hooks/lens/useRepost'

const RepostButton = ({
  post,
  repostsCount
}: {
  post: AnyPost
  repostsCount: number
}) => {
  const { theme } = useTheme()
  const { isAuthenticated } = useSession()
  const { openModal } = useModal()
  const [isReposted, setIsMirrored] = React.useState(false)
  const [newRepostCount, setNewMirrorsCount] = React.useState(repostsCount)

  const { execute: createRepost } = useRepost()

  const mustLogin = (infoMsg: string = 'Must Login'): Boolean => {
    if (!isAuthenticated) {
      openModal('login')
      toast.error(infoMsg)
      return false
    }
    return true
  }

  const handleRepost = async () => {
    try {
      if (!mustLogin('Must Login to mirror')) return
      if (isReposted) return
      setNewMirrorsCount(newRepostCount + 1)
      setIsMirrored(true)
      const result = await createRepost({
        post: post?.id
      })

      if (result.isErr()) {
        toast.error(result?.error?.message)
      }
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  useEffect(() => {
    setNewMirrorsCount(repostsCount)
  }, [repostsCount])

  useEffect(() => {
    if (post?.__typename === 'Repost') return
    setIsMirrored(
      !!post?.operations?.hasReposted?.optimistic ||
      !!post?.operations?.hasReposted?.onChain
    )
  }, [post?.id])

  return (
    <Tooltip title="Repost" arrow>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={handleRepost}
        startIcon={
          <Repeat size={18} className={clsx(isReposted && 'text-brand')} />
        }
        sx={{
          boxShadow: 'none',
          borderRadius: '20px',
          paddingLeft: '14px'
        }}
      >
        <AnimatedCounter
          value={newRepostCount}
          includeDecimals={false}
          includeCommas={true}
          color={theme === 'dark' ? '#ceced3' : '#1f1f23'}
          incrementColor="#1976d2"
          fontSize="15px"
          containerStyles={{
            marginTop: '4px',
            marginBottom: '4px'
          }}
        />
      </Button>
    </Tooltip>
  )
}

export default RepostButton
