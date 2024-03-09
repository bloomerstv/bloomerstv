// import { LimitType, Profile, useSearchProfiles } from '@lens-protocol/react-web'
import { TextField } from '@mui/material'
import React from 'react'
// import formatHandle from '../../../utils/lib/formatHandle'

const WalletAddressTextField = ({
  value,
  settingRecipients,
  index,
  setSettingRecipients
}) => {
  //   const { data } = useSearchProfiles({
  //     query: value,
  //     limit: LimitType.Ten
  //   })

  //   const [profiles, setProfiles] = React.useState<Profile[]>([])

  //   React.useEffect(() => {
  //     if (!data || data?.length === 0) {
  //       setProfiles([])
  //     }
  //     setProfiles(data)
  //   }, [profiles])

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
      <TextField
        type="text"
        label="Recipient"
        value={value}
        onChange={(e) => {
          const newRecipients = [...settingRecipients]
          newRecipients[index].recipient = e.target.value
          setSettingRecipients(newRecipients)
        }}
        disabled={index === 0}
        className="w-full"
        size="small"
      />
    </div>
  )
}

export default WalletAddressTextField
