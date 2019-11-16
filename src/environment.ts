import { KnexConfigs } from "../knexfile"

export function isTest(): boolean {
  return process.env.NODE_ENV === "test"
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

export function isDevelopment(): boolean {
  return !isTest() && !isProduction()
}

export function knexConfigKey(): keyof KnexConfigs {
  return process.env.DATABASE_URL ? "remote" : isTest() ? "test" : "development"
}
