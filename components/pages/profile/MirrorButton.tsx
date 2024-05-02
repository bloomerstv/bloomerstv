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

const MirrorButton = ({ publication }: { publication: AnyPublication }) => {
  const { data: mySession } = useSession()
  const { openModal } = useModal()
  const [isMirrored, setIsMirrored] = React.useState(false)
  const [mirrors, setMirrors] = React.useState(0)

  const { execute: createMirror, loading: mirroring } = useCreateMirror()

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
      const result = await createMirror({
        // @ts-ignore
        mirrorOn: publication?.id,
        sponsored: defaultSponsored
      })

      if (result.isFailure()) {
        toast.error(result?.error?.message)
      }

      setIsMirrored(true)
      setMirrors(mirrors + 1)
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  useEffect(() => {
    if (publication?.__typename === 'Mirror') return
    setIsMirrored(publication?.operations?.hasMirrored)
    setMirrors(publication?.stats?.mirrors)
  }, [publication])
  return (
    <Tooltip title="Mirror" arrow>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={handleMirror}
        startIcon={
          <AutorenewIcon
            className={clsx(
              isMirrored && 'text-brand',
              mirroring && 'animate-spin'
            )}
          />
        }
        sx={{
          boxShadow: 'none',
          borderRadius: '20px'
        }}
      >
        {mirrors}
      </Button>
    </Tooltip>
  )
}

export default MirrorButton
