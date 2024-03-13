import { LimitType, Profile, useSearchProfiles } from '@lens-protocol/react-web'
import { Button, TextField } from '@mui/material'
import React from 'react'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import { SettingRecipientType } from './CollectSettingPopUp'

const WalletAddressTextField = ({
  value,
  settingRecipients,
  index,
  setSettingRecipients
}: {
  value: string
  settingRecipients: SettingRecipientType[]
  index: number
  setSettingRecipients: (value: SettingRecipientType[]) => void
}) => {
  console.log('value', value)
  const { data } = useSearchProfiles({
    query: value,
    limit: LimitType.Ten
  })

  const textRef = React.useRef(null)

  // @ts-ignore
  const open = data && data?.length > 0 && Boolean(textRef?.current)

  console.log('open', open)
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
        <div className="p-2 start-col text-p-text space-y-2 z-30 bg-s-bg shadow-md border-s-border rounded-md absolute w-full bottom-14">
          {data?.slice(0, 4)?.map((profile: Profile) => {
            return (
              <Button
                variant="text"
                style={{ justifyContent: 'flex-start' }}
                key={profile?.id}
                className="text-p-text"
                onClick={() => {
                  const newRecipients = [...settingRecipients]
                  newRecipients[index].handle = profile?.handle?.localName
                  newRecipients[index].recipient = profile?.handle?.ownedBy
                  setSettingRecipients(newRecipients)
                }}
                startIcon={
                  <img
                    src={getAvatar(profile)}
                    className="w-8 h-8 rounded-full"
                  />
                }
              >
                {formatHandle(profile)}
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
          value={value}
          onChange={(e) => {
            const newRecipients = [...settingRecipients]
            newRecipients[index].recipient = e.target.value
            setSettingRecipients(newRecipients)
          }}
          aria-describedby={id}
          disabled={index === 0}
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
