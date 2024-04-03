import { SessionType, useSession } from '@lens-protocol/react-web'
import { useEffect } from 'react'
import { subscribeUserToPush } from '../lib/notification'
import { useAddSubscriptionMutation } from '../../graphql/generated'

const useNotifictionSubscriptions = () => {
  const { data } = useSession()
  const [addSubscription] = useAddSubscriptionMutation()

  useEffect(() => {
    if (data?.type !== SessionType.WithProfile) return
    subscribeUserToPush(async (subscription) => {
      await addSubscription({
        variables: {
          subscription: subscription
        }
      })
    })
  }, [data?.type])
}

export default useNotifictionSubscriptions
