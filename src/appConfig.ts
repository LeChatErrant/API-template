import { get } from 'env-var';

export enum MODES {
  TEST = 'test',
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

export const config = {
  port: get('PORT').required().asPortNumber(),
  sessionSecret: get('SESSION_SECRET').required().asString(),
  mode: get('MODE').required().asEnum(Object.values(MODES)),
  dbUrl: get('DB_URL').required().asString(),
  saltLength: 32,
};

const redisEnabled = config.mode !== MODES.LOCAL;

export const redisConfig = {
  enabled: redisEnabled,
  port: get('REDIS_PORT').required(redisEnabled).asPortNumber(),
  host: get('REDIS_HOST').required(redisEnabled).asString(),
  password: get('REDIS_PASS').required(redisEnabled).asString(),
};
