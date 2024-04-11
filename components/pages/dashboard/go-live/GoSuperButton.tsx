import { Button } from '@mui/material'
import React from 'react'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import Link from 'next/link'
import { useMyStreamQuery } from '../../../../graphql/generated'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { SuperFluidInfo } from '../../../../utils/config'
const GoSuperButton = () => {
  const { data } = useSession()
  const { data: myStream, loading } = useMyStreamQuery({
    skip: data?.type !== SessionType.WithProfile
  })

  if (data?.type !== SessionType.WithProfile || loading) {
    return null
  }
  return (
    <Button
      variant="contained"
      color="secondary"
      LinkComponent={Link}
      href={
        !myStream?.myStream?.premium
          ? SuperFluidInfo.checkoutLink
          : SuperFluidInfo.getCancleLink(data?.address)
      }
      sx={{
        borderRadius: '12px',
        fontWeight: 'bold'
        // backgroundColor: '#000000'
      }}
      startIcon={!myStream?.myStream?.premium ? <RocketLaunchIcon /> : null}
      fullWidth
    >
      {!myStream?.myStream?.premium ? 'Go Super' : 'Cancel Subscription'}
    </Button>
  )
}

export default GoSuperButton
