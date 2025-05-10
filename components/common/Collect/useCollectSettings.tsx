import { Erc20Amount, PostActionType } from '@lens-protocol/react'
import { useCollectPreferences } from '../../store/useCollectPreferences'
import useSession from '../../../utils/hooks/useSession'
type CollectSettingsResponse = {
  type?: PostActionType.SimpleCollectAction
  amount?: Erc20Amount
  collectLimit?: number
  endsAt?: Date
  followerOnly: boolean
  recipient?: string
  referralFee?: number
  // recipients?: RecipientWithSplit[]
}

const useCollectSettings = (): CollectSettingsResponse => {
  const { account, isAuthenticated } = useSession()
  const {
    amount,
    // recipients,
    disableCollect,
    collectLimit,
    referalFee,
    numberOfDays,
    followerOnly
  } = useCollectPreferences((state) => state)

  if (!isAuthenticated || disableCollect) {
    return {
      type: undefined,
      amount: undefined,
      collectLimit: undefined,
      endsAt: undefined,
      followerOnly: false
    }
  }

  return {
    type: PostActionType.SimpleCollectAction,
    // amount && recipients && recipients?.length > 1
    //   ? OpenActionType.MULTIRECIPIENT_COLLECT
    //   : OpenActionType.SIMPLE_COLLECT,
    amount,
    collectLimit,
    endsAt: numberOfDays
      ? new Date(Date.now() + numberOfDays * 24 * 60 * 60 * 1000)
      : undefined,
    referralFee:
      referalFee && referalFee > 0 && referalFee < 100 ? referalFee : undefined,
    // recipients:
    //   amount && recipients && recipients?.length > 0 ? recipients : undefined,
    followerOnly: followerOnly,
    recipient: account?.owner
  }
}

export default useCollectSettings
