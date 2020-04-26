import { get } from 'env-var';

export enum MODES {
  TEST = 'test',
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

export const redisConfig = {
  port: get('REDIS_PORT').required().asPortNumber(),
  host: get('REDIS_HOST').required().asString(),
  password: get('REDIS_PASS').required().asString(),
};

export const config = {
  port: get('PORT').required().asPortNumber(),
  sessionSecret: get('SESSION_SECRET').required().asString(),
  mode: get('MODE').required().asEnum(Object.values(MODES)),
  saltRounds: 12,
};
