import express from 'express';

/*  This import is only used for class-transformer side effects */
import 'reflect-metadata';

import { config } from './appConfig';
import logger from './appLogger';
import router from './components';
import session from './appSession';
import requestLogger from './middlewares/requestLogger';
import errorMiddleware from './middlewares/errorMiddleware';
import notFoundMiddleware from './middlewares/notFoundMiddleware';

/*  Express server  */
const app = express();
const { port } = config;

/*  Middlewares */
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*  Proxy rules */
app.set('trust proxy', true);

/*  Express session */
app.use(session);

/*  Routes  */
app.use(router);

/*  404 middleware  */
app.use(notFoundMiddleware);

/*  Error middleware  */
app.use(errorMiddleware);

/*  App error handlers */
// eslint-disable-next-line no-console
process.on('uncaughtException', (e) => console.error(e));
// eslint-disable-next-line no-console
process.on('unhandledRejection', (e) => console.error(e));

app.listen(port, () => logger.info(`Server listening on port ${port}...`));
