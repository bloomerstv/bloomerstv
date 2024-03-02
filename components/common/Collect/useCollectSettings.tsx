import {
  Erc20Amount,
  OpenActionType,
  RecipientWithSplit,
  SessionType,
  useSession
} from '@lens-protocol/react-web'
import { useCollectPreferences } from '../../store/useCollectPreferences'
type CollectSettingsResponse = {
  type?: OpenActionType.MULTIRECIPIENT_COLLECT | OpenActionType.SIMPLE_COLLECT
  amount?: Erc20Amount
  collectLimit?: number
  endsAt?: Date
  followerOnly: boolean
  recipient?: string
  referralFee?: number
  recipients?: RecipientWithSplit[]
}

const useCollectSettings = (): CollectSettingsResponse => {
  const { data } = useSession()
  const {
    amount,
    recipients,
    disableCollect,
    collectLimit,
    referalFee,
    numberOfDays,
    followerOnly
  } = useCollectPreferences((state) => state)

  if (data?.type !== SessionType.WithProfile || disableCollect) {
    return {
      type: undefined,
      amount: undefined,
      collectLimit: undefined,
      endsAt: undefined,
      followerOnly: false
    }
  }

  return {
    type: amount
      ? OpenActionType.MULTIRECIPIENT_COLLECT
      : OpenActionType.SIMPLE_COLLECT,
    amount,
    collectLimit,
    endsAt: numberOfDays
      ? new Date(Date.now() + numberOfDays * 24 * 60 * 60 * 1000)
      : undefined,
    referralFee:
      referalFee && referalFee > 0 && referalFee < 100 ? referalFee : undefined,
    recipients:
      amount && recipients && recipients?.length > 0 ? recipients : undefined,
    followerOnly: followerOnly
  }
}

export default useCollectSettings
