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
};
