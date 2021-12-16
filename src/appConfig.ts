import { get } from 'env-var';

const env = (name: string, required = true) => get(name).required(required);

export enum MODES {
  TEST = 'test',
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

export const config = {
  port: env('PORT').asPortNumber(),
  whitelist: env('WHITELIST').asArray(','),
  sessionSecret: env('SESSION_SECRET').asString(),
  mode: env('MODE').asEnum(Object.values(MODES)),
  defaultAdminEmail: env('DEFAULT_ADMIN_EMAIL').asString(),
  defaultAdminPassword: env('DEFAULT_ADMIN_PASSWORD').asString(),
  dbUrl: env('DB_URL').asString(),
  saltRounds: 12,
};

const redisEnabled = config.mode !== MODES.LOCAL;

export const redisConfig = {
  enabled: redisEnabled,
  port: env('REDIS_PORT', redisEnabled).asPortNumber(),
  host: env('REDIS_HOST', redisEnabled).asString(),
  password: env('REDIS_PASS', redisEnabled).asString(),
};
