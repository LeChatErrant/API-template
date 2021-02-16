import { Role } from '@prisma/client';

import db from '../appDatabase';
import { config } from '../appConfig';
import logger from '../appLogger';
import { hashPassword } from './hash';

export default async function seedAdminUser() {
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
}
