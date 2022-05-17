/*  This import is used to resolve path aliases, since ts configuration is not enough for the built JS */
import 'module-alias/register';

import app from '@root/app';
import { config } from '@root/app.config';
import { gracefullyCloseConnections, waitServices } from '@root/app.handlers';
import { seedAdminUser } from '@services/database';
import logger from '@services/logger';

const { port } = config;

async function main() {
  await waitServices();
  await seedAdminUser();
  app.listen(port, () => logger.info(`Server listening on port ${port} on mode ${config.mode}...`));
}

main()
  .catch(async (error) => {
    logger.error(error);
    logger.error('Exiting...');
    await gracefullyCloseConnections();
    process.exit(1);
  });
