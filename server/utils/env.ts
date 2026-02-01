import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

let cachedEnv: Record<string, string> | null = null

export function readEnvValue(key: string) {
  if (!cachedEnv) {
    cachedEnv = loadEnvFile()
  }

  return cachedEnv[key]
}

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  const env: Record<string, string> = {}

  try {
    const contents = readFileSync(envPath, 'utf8')
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) {
        continue
      }

      const rawKey = trimmed.slice(0, separatorIndex).trim()
      let rawValue = trimmed.slice(separatorIndex + 1).trim()

      if (
        (rawValue.startsWith('"') && rawValue.endsWith('"'))
        || (rawValue.startsWith('\'') && rawValue.endsWith('\''))
      ) {
        rawValue = rawValue.slice(1, -1)
      }

      if (rawKey) {
        env[rawKey] = rawValue
      }
    }
  } catch {
    return env
  }

  return env
}
