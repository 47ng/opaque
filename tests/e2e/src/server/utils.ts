import crypto from 'node:crypto'

export function generateNonce() {
  return crypto.randomBytes(32).toString('hex')
}

export const nonceRegexp = /^[0-9a-f]{64}$/i
