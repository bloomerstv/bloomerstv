import React from 'react'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import CollectSettingPopUp from './CollectSettingPopUp'
import clsx from 'clsx'
import { useCollectPreferences } from '../../store/useCollectPreferences'
import { IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import LayersIcon from '@mui/icons-material/Layers'

const CollectSettingButton = ({ className }: { className?: string }) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { amount, disableCollect, collectLimit, referalFee, numberOfDays } =
    useCollectPreferences((state) => state)

  return (
    <>
      <ModalWrapper
        open={open}
        title="Collect Settings"
        Icon={<LayersIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        classname="w-[500px]"
      >
        <CollectSettingPopUp />
      </ModalWrapper>

      <div
        className={clsx(
          'start-center-row cursor-pointer text-white bg-brand rounded-full pl-2 py-1 pr-1 space-x-2 text-xs shrink-0 w-fit shrink-0',
          className
        )}
        onClick={handleOpen}
      >
        {/* preview */}
        <div className="centered-row gap-x-2">
          <LayersIcon fontSize="small" />

          <div className="centered-col">
            <div className={clsx('font-semibold text-base leading-4')}>
              {disableCollect ? 'Collect disabled' : 'Hold to collect'}
            </div>

            {!disableCollect ? (
              <div className="start-center-row space-x-2">
                {/* @ts-ignore */}
                {amount?.value && amount?.asset?.symbol && (
                  // @ts-ignore
                  <span>{`${amount?.value} ${amount.asset.symbol}`}</span>
                )}

                {collectLimit && (
                  <span>{`${collectLimit}/${collectLimit} left`}</span>
                )}

                {referalFee && amount && (
                  <span className="centered-row gap-x-0.5">
                    <CurrencyExchangeIcon fontSize="inherit" />
                    {`${referalFee}%`}
                  </span>
                )}

                {numberOfDays && (
                  <span className="centered-row gap-x-0.5">
                    <AccessTimeIcon fontSize="inherit" />
                    {`${numberOfDays}d`}
                  </span>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* setting button  */}
        <div className="bg-white rounded-full">
          <IconButton
            className="text-xs"
            sx={{
              fontSize: '16px'
            }}
          >
            <SettingsIcon fontSize="inherit" className="text-[#848491]" />
          </IconButton>
        </div>
      </div>
    </>
  )
}

export default React.memo(CollectSettingButton)
