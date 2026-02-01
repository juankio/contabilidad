import { MongoClient } from 'mongodb'
import { createError } from 'h3'
import { readEnvValue } from './env'

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

export async function getMongoClient() {
  const mongoUri = getMongoUri()

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(mongoUri)
    globalWithMongo._mongoClientPromise = client.connect()
  }

  return globalWithMongo._mongoClientPromise as Promise<MongoClient>
}

export async function getMongoDb() {
  const mongoUri = getMongoUri()
  const client = await getMongoClient()
  const dbName = getDbNameFromUri(mongoUri) ?? 'contabilidad'
  return client.db(dbName)
}

function getMongoUri() {
  const runtimeConfig = useRuntimeConfig()
  const mongoUri = runtimeConfig.mongoUri || process.env.MONGO_URI || readEnvValue('MONGO_URI') || ''

  if (!mongoUri) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing MONGO_URI runtime config'
    })
  }

  return mongoUri
}

function getDbNameFromUri(uri: string) {
  try {
    const url = new URL(uri)
    const name = url.pathname.replace(/^\/+/, '')
    return name || null
  } catch {
    return null
  }
}
