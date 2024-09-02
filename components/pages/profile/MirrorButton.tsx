import { Button, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import { defaultSponsored } from '../../../utils/config'
import toast from 'react-hot-toast'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import {
  AnyPublication,
  SessionType,
  useCreateMirror,
  useSession
} from '@lens-protocol/react-web'
import { useModal } from '../../common/ModalContext'
import clsx from 'clsx'
import { AnimatedCounter } from 'react-animated-counter'
import { useTheme } from '../../wrappers/TailwindThemeProvider'

const MirrorButton = ({
  publication,
  mirrorsCount
}: {
  publication: AnyPublication
  mirrorsCount: number
}) => {
  const { theme } = useTheme()
  const { data: mySession } = useSession()
  const { openModal } = useModal()
  const [isMirrored, setIsMirrored] = React.useState(false)
  const [newMirrorsCount, setNewMirrorsCount] = React.useState(mirrorsCount)

  const { execute: createMirror } = useCreateMirror()

  const mustLogin = (infoMsg: string = 'Must Login'): Boolean => {
    if (mySession?.type !== SessionType.WithProfile) {
      openModal('login')
      toast.error(infoMsg)
      return false
    }
    return true
  }

  const handleMirror = async () => {
    try {
      if (!mustLogin('Must Login to mirror')) return
      if (isMirrored) return
      setNewMirrorsCount(newMirrorsCount + 1)
      setIsMirrored(true)
      const result = await createMirror({
        // @ts-ignore
        mirrorOn: publication?.id,
        sponsored: defaultSponsored
      })

      if (result.isFailure()) {
        toast.error(result?.error?.message)
      }
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  useEffect(() => {
    setNewMirrorsCount(mirrorsCount)
  }, [mirrorsCount])

  useEffect(() => {
    if (publication?.__typename === 'Mirror') return
    setIsMirrored(publication?.operations?.hasMirrored)
  }, [publication?.id])
  return (
    <Tooltip title="Mirror" arrow>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={handleMirror}
        startIcon={
          <AutorenewIcon className={clsx(isMirrored && 'text-brand')} />
        }
        sx={{
          boxShadow: 'none',
          borderRadius: '20px',
          paddingLeft: '14px'
        }}
      >
        <AnimatedCounter
          value={newMirrorsCount}
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

export default MirrorButton
