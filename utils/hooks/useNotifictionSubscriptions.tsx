import { useEffect } from 'react'
import { subscribeUserToPush } from '../lib/notification'
import { useAddSubscriptionMutation } from '../../graphql/generated'
import useSession from './useSession'

const useNotifictionSubscriptions = () => {
  const { isAuthenticated } = useSession()
  const [addSubscription] = useAddSubscriptionMutation()

  useEffect(() => {
    if (!isAuthenticated) return
    subscribeUserToPush(async (subscription) => {
      await addSubscription({
        variables: {
          subscription: subscription
        }
      })
    })
  }, [isAuthenticated])
}

export default useNotifictionSubscriptions
