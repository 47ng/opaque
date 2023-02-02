import { hex } from '@47ng/codec'
import initOpaqueWasm, { Login, Registration } from '@47ng/opaque-client'
import type { AuthFormValues } from '../components/AuthForm'

export async function signup({ username, password }: AuthFormValues) {
  await initOpaqueWasm()
  const registration = new Registration()
  const registrationRequest = hex.encode(registration.start(password))
  const fetch1Result = await fetch('/api/signup/request', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username,
      registrationRequest,
    }),
  })
  // todo: Parse
  const { nonce, registrationResponse } = await fetch1Result.json()
  const registrationRecord = hex.encode(
    registration.finish(password, hex.decode(registrationResponse))
  )
  await fetch('/api/signup/record', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      nonce,
      registrationRecord,
    }),
  })
  const exportKey = hex.encode(registration.getExportKey())
  console.dir({ exportKey })
  registration.free()
}

export async function login({ username, password }: AuthFormValues) {
  await initOpaqueWasm()
  const login = new Login()
  const loginRequest = hex.encode(login.start(password))
  const fetch1Result = await fetch('/api/login/request', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username,
      loginRequest,
    }),
  })
  const { nonce, loginResponse } = await fetch1Result.json()
  const loginRecord = hex.encode(
    login.finish(password, hex.decode(loginResponse))
  )
  await fetch('/api/login/record', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      nonce,
      loginRecord,
    }),
  })
  const exportKey = hex.encode(login.getExportKey())
  const sessionKey = hex.encode(login.getSessionKey())
  console.dir({
    exportKey,
    sessionKey,
  })
  login.free()
}
