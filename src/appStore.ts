import redis from 'redis';
import connectRedis from 'connect-redis';
import session, { MemoryStore, Store } from 'express-session';

import logger from './appLogger';
import { redisConfig } from './appConfig';

let store: Store | MemoryStore;
let redisClient: redis.RedisClient | null = null;

if (redisConfig.enabled) {
  redisClient = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
  });
  redisClient.on('error', (err) => logger.error(err));

  const RedisStore = connectRedis(session);
  store = new RedisStore({ client: redisClient });
} else {
  store = new MemoryStore();
}

export default { store, redisClient };
