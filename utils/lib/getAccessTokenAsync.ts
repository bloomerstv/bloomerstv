import { lensUrl, localStorageCredKey } from '../config'

export const getAccessToken = async (): Promise<null | string> => {
  try {
    // get json data from lens.development.credentials key from localhost
    const cred = localStorage.getItem(localStorageCredKey)
    if (!cred) return null
    const credJson = JSON.parse(cred)
    // get token from json data
    const refreshToken = credJson?.data?.refreshToken
    if (!refreshToken) return null

    const res = await fetch(lensUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
        mutation {
            refresh(request: {
                refreshToken: "${refreshToken}"
            }) {
                accessToken
                refreshToken
            }
        }
      `
      })
    })

    if (res.status !== 200) return null

    const json = await res.json()

    const accessToken = json?.data?.refresh?.accessToken

    if (!accessToken) return null

    // set refresh token to local storage

    const newRefreshToken = json?.data?.refresh?.refreshToken

    if (!newRefreshToken) return null

    const newCredJson = {
      ...credJson,
      data: {
        ...credJson.data,
        refreshToken: newRefreshToken
      }
    }

    localStorage.setItem(localStorageCredKey, JSON.stringify(newCredJson))

    return accessToken
  } catch (e) {
    return null
  }
}
