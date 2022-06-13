import { dbConfig } from '@root/app.config';
import db from '@services/database';
import logger from '@services/logger';
import redisClient from '@services/redis';

/**
 * Wait for all services to be up
 */
export async function waitServices() {
  /*  Prisma  */
  logger.info('Waiting database...');
  await db
    .$connect()
    .then(() => {
      logger.info('Connected to database !');
    })
    .catch((error) => {
      logger.error(error);
      logger.error(`Can't connect to database at url ${dbConfig.url}`);
      throw error;
    });

  /*  Redis */
  if (redisClient) {
    logger.info('Waiting redis...');
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        const isConnected = redisClient.ping();
        if (isConnected) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
    logger.info('Connected to redis !');
  }
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
    })
    .catch((error) => {
      logger.error(error);
      throw error;
    });

  /*  Redis */
  if (redisClient) {
    logger.info('Disconnecting from redis...');
    await new Promise<void>((resolve, reject) => {
      redisClient.quit((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    logger.info('Disconnected from redis !');
  }
}
