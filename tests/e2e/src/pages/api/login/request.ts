import { hex, utf8 } from '@47ng/codec'
import { HandleLogin, set_panic_hook } from '@47ng/opaque-server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { kv } from '../../../server/kv'
import { serverSetup } from '../../../server/opaqueServerSetup'
import { generateNonce } from '../../../server/utils'

set_panic_hook()

const requestBodySchema = z.object({
  username: z.string(),
  loginRequest: z.string(), // todo: Add regexp for format & length
})

export default async function handleOpaqueLoginRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Only POST is supported',
    })
  }
  const { username, loginRequest } = requestBodySchema.parse(req.body)
  const userRecord = await kv.get({
    ns: 'users',
    key: username,
    parser: z.object({ passwordFile: z.string() }).parse,
  })
  if (!userRecord) {
    return res.status(403).json({
      error: 'Invalid username / password combination',
    })
  }

  const login = new HandleLogin(serverSetup)
  const loginResponse = hex.encode(
    login.start(
      hex.decode(userRecord.passwordFile),
      utf8.encode(username),
      hex.decode(loginRequest)
    )
  )
  const loginState = hex.encode(login.serialize())
  login.free()
  const nonce = generateNonce()
  await kv.set({
    ns: 'login',
    key: nonce,
    value: {
      username,
      loginState,
    },
    ttl: 120,
  })
  return res.json({
    nonce,
    loginResponse,
  })
}
