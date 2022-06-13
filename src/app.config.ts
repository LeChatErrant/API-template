import { get } from 'env-var';

const env = (name: string, required = true) => get(name).required(required);

export const config = {
  port: env('PORT').asPortNumber(),
  whitelist: env('WHITELIST').asArray(','),
  sessionSecret: env('SESSION_SECRET').asString(),
  secureCookies: env('SECURE_COOKIES').asBoolStrict(),
  defaultAdminEmail: env('DEFAULT_ADMIN_EMAIL').asString(),
  defaultAdminPassword: env('DEFAULT_ADMIN_PASSWORD').asString(),
  saltRounds: 12,
};

export const dbConfig = {
  url: env('DATABASE_URL').asString(),
};

export const redisConfig = {
  port: env('REDIS_PORT').asPortNumber(),
  host: env('REDIS_HOST').asString(),
  password: env('REDIS_PASS').asString(),
};
