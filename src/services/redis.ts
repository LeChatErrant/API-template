import redis from 'redis';

import { redisConfig } from '@root/app.config';
import logger from '@services/logger';

const redisClient = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
});
redisClient.on('error', (err) => logger.error(err));

export default redisClient;
