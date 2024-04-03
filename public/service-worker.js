self.addEventListener('push', (event) => {
  // Handle push notification event here

  if (event.data) {
    const pushData = event.data.json()
    const title = pushData.title

    // add the fields only if the value is not null
    const options = {
      [pushData?.body ? 'body' : null]: pushData?.body || null,
      [pushData?.image ? 'image' : null]: pushData?.image || null,
      [pushData?.data ? 'data' : null]: pushData?.data || null,
      icon: pushData?.icon || 'https://bloomers.tv/icon-192x192.png'
    }
    event.waitUntil(self.registration.showNotification(title, options))
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  // Handle notification click event here
  // redirect according to the notification
  const urlToOpen =
    event?.notification?.data?.url ||
    new URL('https://bloomers.tv', self.location.origin).href
  const clients = self.clients
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = null

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i]
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient
          break
        }
      }

      if (matchingClient) {
        return matchingClient.focus()
      } else {
        return clients.openWindow(urlToOpen)
      }
    })

  event.waitUntil(promiseChain)
})
