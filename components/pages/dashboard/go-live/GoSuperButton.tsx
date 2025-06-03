import { Button } from '@mui/material'
import React from 'react'
import { Rocket } from 'lucide-react'
import Link from 'next/link'
import { useMyStreamQuery } from '../../../../graphql/generated'
import { SuperFluidInfo } from '../../../../utils/config'
import useSession from '../../../../utils/hooks/useSession'
const GoSuperButton = () => {
  const { account, isAuthenticated } = useSession()
  const { data: myStream, loading } = useMyStreamQuery({
    skip: !isAuthenticated
  })

  if (!isAuthenticated || loading) {
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
          : SuperFluidInfo.getCancleLink(account?.owner)
      }
      sx={{
        borderRadius: '12px',
        fontWeight: 'bold'
        // backgroundColor: '#000000'
      }}
      startIcon={!myStream?.myStream?.premium ? <Rocket /> : null}
      fullWidth
    >
      {!myStream?.myStream?.premium ? 'Go Super' : 'Cancel Subscription'}
    </Button>
  )
}

export default GoSuperButton
