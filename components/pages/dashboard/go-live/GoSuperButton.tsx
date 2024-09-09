import { Button } from '@mui/material'
import React from 'react'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { useMyStreamQuery } from '../../../../graphql/generated'
import { SessionType, useSession } from '@lens-protocol/react-web'
import SuperfluidWidget from '@superfluid-finance/widget'
import { superfluidData } from '../../../../utils/lib/superfluidData'
import superTokenList from '@superfluid-finance/tokenlist'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const GoSuperButton = () => {
  const { openConnectModal, connectModalOpen } = useConnectModal()
  const { data } = useSession()
  const { data: myStream, loading } = useMyStreamQuery({
    skip: data?.type !== SessionType.WithProfile
  })

  if (data?.type !== SessionType.WithProfile || loading) {
    return null
  }
  return (
    <SuperfluidWidget
      tokenList={superTokenList}
      // @ts-ignore
      type={'dialog'}
      walletManager={{
        isOpen: connectModalOpen,
        open: async () => openConnectModal?.()
      }}
      {...superfluidData}
    >
      {({ openModal }) => (
        <Button
          variant="contained"
          color="secondary"
          // LinkComponent={Link}
          // href={
          //   !myStream?.myStream?.premium
          //     ? SuperFluidInfo.checkoutLink
          //     : SuperFluidInfo.getCancleLink(data?.address)
          // }
          onClick={() => openModal()}
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
      )}
    </SuperfluidWidget>
  )
}

export default GoSuperButton
