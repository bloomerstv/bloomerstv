import { createRemoteJWKSet, jwtVerify } from 'jose'
import { LENS_JWKS_URL } from '../../config'

export type DecodedLensIDToken = {
  sub: string
  iss: string
  aud: string
  iat: number
  exp: number
  sid: string
  act?: {
    sub: string
  }
  'tag:lens.dev,2024:sponsored'?: boolean
  'tag:lens.dev,2024:role'?: string
}
// Get JWKS URI from environment variables
const JWKS = createRemoteJWKSet(new URL(LENS_JWKS_URL))

/**
 * Verifies and decodes a Lens ID Token
 *
 * The token contains the following claims:
 * @param {string} token - The JWT token to verify
 * @returns {Promise<DecodedLensIDToken>} Decoded token with the following fields:
 * - sub: Subject - the signedBy address used to sign the Authentication Challenge
 *        Could be the Account or an Account Manager
 * - iss: Issuer - the Lens API endpoint that issued the token (e.g. https://api.lens.xyz)
 * - aud: Audience - the Lens App address that the token is intended for
 * - iat: Issued At - timestamp when the token was issued
 * - exp: Expiration - timestamp indicating when the token will expire
 * - sid: Session ID - unique identifier for the session
 * - act: Optional claim for Account Managers to specify the Account address they act on behalf of
 * - tag:lens.dev,2024:sponsored: Indicates if the session is enabled for sponsored transactions
 * - tag:lens.dev,2024:role: Role of the authenticated session (ACCOUNT_OWNER, ACCOUNT_MANAGER,
 *                          ONBOARDING_USER, or BUILDER)
 */
export async function lensJWTVerifyIDToken(
  token: string
): Promise<DecodedLensIDToken> {
  const { payload } = await jwtVerify(token, JWKS)

  return payload as DecodedLensIDToken
}
