import { Role } from '@prisma/client';

import db from '../appDatabase';
import { config } from '../appConfig';
import logger from '../appLogger';
import { hashPassword } from './hash';

export default async function seedAdminUser() {
  logger.info('Seeding root user...');

  const alreadyExists = !!await db.user.findUnique({
    where: {
      email: config.defaultAdminEmail,
    },
  });

  if (alreadyExists) {
    logger.info('Root user already exists');
    return;
  }

  const hashedPassword = await hashPassword(config.defaultAdminPassword);
  await db.user.create({
    data: {
      role: Role.ADMIN,
      name: 'root',
      email: config.defaultAdminEmail,
      password: hashedPassword,
    },
  });
}
