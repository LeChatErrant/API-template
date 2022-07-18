import { dbConfig, redisConfig } from '@root/app.config';
import db from '@services/database';
import logger from '@services/logger';
import redis from '@services/redis';

/**
 * Wait for all services to be up
 */
export async function waitServices() {
  /*  Prisma  */
  logger.info('Connecting to database...');
  await db
    .$connect()
    .then(() => {
      logger.info('Connected to database !');
    })
    .catch((error) => {
      logger.error(`Can't connect to database at url ${dbConfig.url}`);
      logger.debug('Try running `npm run dev:db` to quickly launch a PostgreSQL instance !');
      throw error;
    });

  /*  Redis */
  logger.info('Connecting to redis...');
  try {
    await redis.connect();
  } catch (error) {
    logger.error(`Can't connect to redis at url redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`);
    logger.debug('Try running `npm run dev:redis` to quickly launch a Redis instance !');
    throw error;
  }
  logger.info('Connected to redis !');
}

/**
 * Gracefully close connection with services to avoid zombies processes
 */
export async function gracefullyCloseConnections() {
  /*  Prisma  */
  logger.info('Disconnecting from database...');
  await db
    .$disconnect()
    .then(() => {
      logger.info('Disconnected from database !');
    });

  /*  Redis */
  logger.info('Disconnecting from redis...');
  await redis.disconnect();
  logger.info('Disconnected from redis !');
}
