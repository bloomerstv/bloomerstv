import { lensUrl, localStorageCredKey } from '../config'
import { lensJWTVerifyIDToken } from '../hooks/lens/lensJWTVerify'

export const getIdentityTokenAsync = async (): Promise<null | string> => {
  try {
    // get json data from lens.development.credentials key from localhost
    const cred = localStorage.getItem(localStorageCredKey)

    if (!cred) return null
    const credJson = JSON.parse(cred)

    // get token from json data
    const refreshToken = credJson?.data?.refreshToken

    if (!refreshToken) return null

    let isVerifiedToken = false

    try {
      await lensJWTVerifyIDToken(credJson?.data?.idToken)
      isVerifiedToken = true
    } catch (e) {
      console.log('Error verifying token', e)
    }

    if (isVerifiedToken) {
      return credJson?.data?.idToken
    }

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
                 ... on AuthenticationTokens {
                    accessToken
                    refreshToken
                    idToken
                  }

                  ... on ForbiddenError {
                    reason
                  }
            }
        }
      `
      })
    })

    const json = await res.json()

    if (!json?.data) {
      // remove localStorageCredKey
      localStorage.removeItem(localStorageCredKey)
      return null
    }

    if (!json?.data?.refresh) return null

    const identityToken = json?.data?.refresh?.idToken

    const newCredJson = {
      ...credJson,
      data: json?.data?.refresh,
      metadata: {
        ...credJson.metadata,
        updatedAt: new Date().getTime()
      }
    }

    localStorage.setItem(localStorageCredKey, JSON.stringify(newCredJson))

    return identityToken
  } catch (e) {
    return null
  }
}
