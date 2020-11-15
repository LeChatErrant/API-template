import redis from 'redis';
import connectRedis from 'connect-redis';
import session, { MemoryStore, Store } from 'express-session';

import logger from './appLogger';
import { redisConfig } from './appConfig';

// eslint-disable-next-line import/no-mutable-exports
let store: Store | MemoryStore;

if (redisConfig.enabled) {
  const redisClient = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
  });
  redisClient.on('error', (err) => logger.error(err));

  const RedisStore = connectRedis(session);
  store = new RedisStore({ client: redisClient });
  logger.info('Connecting to Redis...');
} else {
  store = new MemoryStore();
}

export default store;
