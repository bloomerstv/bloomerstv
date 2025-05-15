import React from 'react'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import { Account } from '@lens-protocol/react'

const MobileAccountList = ({ account }: { account: Account }) => {
  return (
    <div className="centered-row ">
      <img
        src={getAvatar(account)}
        alt="avatar"
        className="w-10 sm:w-8 h-10 sm:h-8 rounded-full"
      />
      <div className="flex-grow ml-3">
        <div className="text-xl sm:text-lg text-p-text font-bold">
          {formatHandle(account)}
        </div>
      </div>
    </div>
  )
}

export default MobileAccountList
