import { hex } from '@47ng/codec'
import { HandleRegistration, set_panic_hook } from '@47ng/opaque-server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { kv } from '../../../server/kv'
import { serverSetup } from '../../../server/opaqueServerSetup'
import { nonceRegexp } from '../../../server/utils'

set_panic_hook()

const requestBodySchema = z.object({
  nonce: z.string().regex(nonceRegexp),
  registrationRecord: z.string(), // todo: Add regexp for format & length
})

export default async function handleOpaqueSignupRecord(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Only POST is supported',
    })
  }
  const { nonce, registrationRecord } = requestBodySchema.parse(req.body)
  const username = await kv.get({
    ns: 'registration',
    key: nonce,
    parser: z.string().parse,
  })
  if (!username) {
    return res.status(408).json({
      error: 'Timeout',
      message: 'Failed to finish signing up, please try again.',
    })
  }
  const registration = new HandleRegistration(serverSetup)
  const passwordFile = hex.encode(
    registration.finish(hex.decode(registrationRecord))
  )
  await kv.set({
    ns: 'users',
    key: username,
    value: {
      passwordFile,
    },
  })
  await kv.del({ ns: 'registration', key: nonce })
  return res.status(204).send(null)
}
