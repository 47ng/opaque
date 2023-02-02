import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const kvFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../.volumes/kv.json'
)

const kvItemSchema = z.object({
  value: z.unknown(),
  expiresAt: z
    .string()
    .datetime()
    .transform(str => new Date(str))
    .optional(),
})
const kvStoreSchema = z.record(z.string(), kvItemSchema)

type KvStore = z.infer<typeof kvStoreSchema>

const kvStore = load()

type KvKeyParams = {
  ns?: string
  key: string
}

type SetParams<T> = KvKeyParams & {
  value: T
  ttl?: number
}

const storageKey = (ns: string, key: string) => [ns, key].join(':')

async function set<T>({ ns = '<root>', key, value, ttl }: SetParams<T>) {
  const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : undefined
  kvStore[storageKey(ns, key)] = {
    value,
    expiresAt,
  }
  await persist()
}

type GetParams<T> = KvKeyParams & {
  parser: (x: unknown) => T
}

async function get<T>({
  ns = '<root>',
  key,
  parser,
}: GetParams<T>): Promise<T | undefined> {
  const sk = storageKey(ns, key)
  const item = kvStore[sk]
  if (!item) {
    return undefined
  }
  if (item.expiresAt && item.expiresAt.valueOf() < Date.now()) {
    delete kvStore[sk]
    await persist()
    return undefined
  }
  return parser(item.value)
}

async function del({ ns = '<root>', key }: KvKeyParams) {
  delete kvStore[storageKey(ns, key)]
  return persist()
}

export const kv = {
  get,
  set,
  del,
}

// --

function load(): KvStore {
  try {
    const kvJson = fsSync.readFileSync(kvFile, 'utf8')
    return kvStoreSchema.parse(JSON.parse(kvJson))
  } catch {
    return {}
  }
}

async function persist() {
  await fs.mkdir(path.dirname(kvFile), { recursive: true }).catch()
  return fs.writeFile(
    kvFile,
    JSON.stringify(
      kvStore,
      (key, value) => {
        if (key === 'expiresAt' && value instanceof Date) {
          return value.toISOString()
        }
        return value
      },
      2
    )
  )
}
