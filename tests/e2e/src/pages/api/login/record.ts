import { hex } from '@47ng/codec'
import { HandleLogin, set_panic_hook } from '@47ng/opaque-server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { kv } from '../../../server/kv'
import { serverSetup } from '../../../server/opaqueServerSetup'
import { nonceRegexp } from '../../../server/utils'

set_panic_hook()

const requestBodySchema = z.object({
  nonce: z.string().regex(nonceRegexp),
  loginRecord: z.string(), // todo: Add regexp for format & length
})

export default async function handleOpaqueLoginRecord(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Only POST is supported',
    })
  }
  const { nonce, loginRecord } = requestBodySchema.parse(req.body)
  const userLogin = await kv.get({
    ns: 'login',
    key: nonce,
    parser: z.object({ username: z.string(), loginState: z.string() }).parse,
  })
  if (!userLogin) {
    return res.status(408).json({
      error: 'Timeout',
      message: 'Failed to finish signing up, please try again.',
    })
  }
  const login = HandleLogin.deserialize(
    hex.decode(userLogin.loginState),
    serverSetup
  )
  const sharedKey = hex.encode(login.finish(hex.decode(loginRecord)))
  console.info(`Shared key: ${sharedKey}`)
  await kv.del({ ns: 'login', key: nonce })
  return res.status(204).send(null)
}
