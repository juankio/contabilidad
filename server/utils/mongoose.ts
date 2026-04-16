import mongoose from 'mongoose'
import { createError } from 'h3'
import { readEnvValue } from './env'

const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>
  _mongooseLogged?: boolean
}

export async function connectMongoose() {
  if (globalWithMongoose._mongooseConn) {
    return globalWithMongoose._mongooseConn
  }

  const mongoUri = getMongoUri()
  globalWithMongoose._mongooseConn = mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000
  }).then((conn) => {
    if (!globalWithMongoose._mongooseLogged) {
      globalWithMongoose._mongooseLogged = true
      console.info('[mongo] conectado y configurado pool')
    }
    return conn
  })
  return globalWithMongoose._mongooseConn
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
