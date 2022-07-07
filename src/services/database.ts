import { PrismaClient, Role } from '@prisma/client';

import { config, dbConfig } from '@root/app.config';
import { createChildLogger } from '@services/logger';
import { hashPassword } from '@utils/hash';

const logger = createChildLogger('database');

const db = new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.url,
    },
  },
  log: [
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

db.$on('info', (e) => logger.info(e.message));
db.$on('warn', (e) => logger.warn(e.message));

export async function seedAdminUser() {
  logger.info('Seeding root user...');

  const alreadyExists = !!await db.user.findFirst({
    where: {
      role: Role.ADMIN,
    },
  });

  if (alreadyExists) {
    logger.info('Root user already exists. Skipping database seeding');
    return;
  }

  const hashedPassword = await hashPassword(config.defaultAdminPassword);
  await db.user.create({
    data: {
      role: Role.ADMIN,
      username: 'root',
      email: config.defaultAdminEmail,
      password: hashedPassword,
    },
  });
  logger.info('Root user created !');
}

export default db;
