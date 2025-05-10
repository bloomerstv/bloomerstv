import { Button, TextField } from '@mui/material'
import React from 'react'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import { SettingRecipientType } from './CollectSettingPopUp'
import { Account, useAccounts } from '@lens-protocol/react'

const WalletAddressTextField = ({
  value,
  settingRecipients,
  isSubscribedToSuperBloomers,
  index,
  setSettingRecipients
}: {
  value: string
  settingRecipients: SettingRecipientType[]
  index: number
  isSubscribedToSuperBloomers: boolean
  setSettingRecipients: (value: SettingRecipientType[]) => void
}) => {
  const { data } = useAccounts({
    filter: {
      searchBy: {
        localNameQuery: value
      }
    },
    pageSize: 10
  })

  const textRef = React.useRef(null)

  const open = data && data?.items.length > 0 && Boolean(textRef?.current)

  const id = open ? 'transition-popper' : undefined

  return (
    <div className="w-full relative">
      {/* <div className="">
        {profiles?.map((profile: Profile) => {
          return (
            <div className="" key={profile?.id}>
              {formatHandle(profile)}
            </div>
          )
        })}
      </div> */}
      {open && (
        <div className="p-2 start-col text-p-text space-y-1 z-30 bg-s-bg shadow-md border-s-border rounded-md absolute w-full bottom-14">
          {data?.items.slice(0, 4)?.map((account: Account) => {
            return (
              <Button
                variant="text"
                size="small"
                style={{
                  justifyContent: 'flex-start',
                  paddingLeft: '10px',
                  borderRadius: '6px'
                }}
                key={account?.address}
                className="text-p-text"
                onClick={() => {
                  const newRecipients = [...settingRecipients]
                  newRecipients[index].handle = account?.username?.localName
                  newRecipients[index].recipient = account?.owner
                  setSettingRecipients(newRecipients)
                }}
                startIcon={
                  <img
                    src={getAvatar(account)}
                    className="w-8 h-8 rounded-full"
                  />
                }
              >
                {formatHandle(account)}
              </Button>
            )
            // return (
            //   <div
            //     className="space-x-2 start-center-row bg-s-bg"
            //     key={profile?.id}
            //   >
            //     <img
            //       src={getAvatar(profile)}
            //       className="w-8 h-8 rounded-full"
            //     />
            //     <div className="text-sm font-bold">{formatHandle(profile)}</div>
            //   </div>
            // )
          })}
        </div>
      )}

      <div ref={textRef}>
        <TextField
          type="text"
          label="Recipient"
          placeholder="kontak or 0x..."
          value={value}
          onChange={(e) => {
            const newRecipients = [...settingRecipients]
            newRecipients[index].recipient = e.target.value
            setSettingRecipients(newRecipients)
          }}
          aria-describedby={id}
          disabled={index === 0 && !isSubscribedToSuperBloomers}
          className="w-full"
          size="small"
          helperText={settingRecipients[index]?.handle}
          FormHelperTextProps={{
            sx: {
              marginTop: '-3px'
            }
          }}
        />
      </div>
    </div>
  )
}

export default WalletAddressTextField
