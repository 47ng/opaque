import { hex, utf8 } from '@47ng/codec'
import { HandleRegistration, set_panic_hook } from '@47ng/opaque-server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { kv } from '../../../server/kv'
import { serverSetup } from '../../../server/opaqueServerSetup'
import { generateNonce } from '../../../server/utils'

set_panic_hook()

const requestBodySchema = z.object({
  username: z.string(),
  registrationRequest: z.string(), // todo: Add regexp for format & length
})

export default async function handleOpaqueSignupRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Only POST is supported',
    })
  }
  const { username, registrationRequest } = requestBodySchema.parse(req.body)
  const registration = new HandleRegistration(serverSetup)
  const registrationResponse = registration.start(
    utf8.encode(username),
    hex.decode(registrationRequest)
  )
  registration.free()
  const nonce = generateNonce()
  await kv.set({
    ns: 'registration',
    key: nonce,
    value: username,
    ttl: 120,
  })
  return res.json({
    nonce,
    registrationResponse: hex.encode(registrationResponse),
  })
}
