import React from 'react'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import CollectSettingPopUp from './CollectSettingPopUp'
import clsx from 'clsx'
import { useCollectPreferences } from '../../store/useCollectPreferences'
import { IconButton } from '@mui/material'
import { Settings, Clock, ArrowLeftRight, Layers } from 'lucide-react'

const CollectSettingButton = ({
  className,
  disabled = false
}: {
  className?: string
  disabled?: boolean
}) => {
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
        Icon={<Layers />}
        onClose={handleClose}
        onOpen={handleOpen}
        classname="w-[500px]"
      >
        <CollectSettingPopUp />
      </ModalWrapper>

      <button
        className={clsx(
          'start-center-row border-0 cursor-pointer text-white bg-brand rounded-full pl-2 py-1 pr-1 space-x-2 text-xs shrink-0 w-fit shrink-0',
          className
        )}
        disabled={disabled}
        onClick={handleOpen}
      >
        {/* preview */}
        <div className="centered-row gap-x-2">
          <Layers />

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
                    <ArrowLeftRight />
                    {`${referalFee}%`}
                  </span>
                )}

                {numberOfDays && (
                  <span className="centered-row gap-x-0.5">
                    <Clock />
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
            <Settings />
          </IconButton>
        </div>
      </button>
    </>
  )
}

export default React.memo(CollectSettingButton)
