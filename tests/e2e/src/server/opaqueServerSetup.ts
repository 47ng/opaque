import { hex } from '@47ng/codec'
import { ServerSetup } from '@47ng/opaque-server'

function loadServerSetup() {
  if (!process.env.OPAQUE_SERVER_SETUP) {
    const serverSetup = new ServerSetup()
    console.info(`Add the following variable to your .env and start the server again:

  OPAQUE_SERVER_SETUP=${hex.encode(serverSetup.serialize())}

  `)
    serverSetup.free()
    process.exit(1)
  }
  const serverState = hex.decode(process.env.OPAQUE_SERVER_SETUP)
  return ServerSetup.deserialize(serverState)
}

export const serverSetup = loadServerSetup()
