import Redis from 'ioredis';

import { redisConfig } from '@root/app.config';
import { createChildLogger } from '@root/services/logger';

/**
 * Custom scoped logger
 */
const logger = createChildLogger('redis');

/**
 * Redis client instance
 */
const redis = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  lazyConnect: true,
});
redis.on('error', (err) => logger.error(err));

export default redis;
