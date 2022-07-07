import redis from 'redis';

import { redisConfig } from '@root/app.config';
import { createChildLogger } from '@services/logger';

const logger = createChildLogger('redis');

const redisClient = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
});
redisClient.on('error', (err) => logger.error(err));

export default redisClient;
