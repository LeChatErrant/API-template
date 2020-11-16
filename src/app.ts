import express from 'express';
import createError from 'http-errors';
import httpStatus from 'http-status-codes';

/*  This import is only used for class-transformer side effects */
import 'reflect-metadata';

import { config, MODES } from './appConfig';
import logger from './appLogger';
import router from './components';
import session from './appSession';
import requestLogger from './middlewares/requestLogger';
import errorMiddleware from './middlewares/errorMiddleware';

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
app.use((req, res, next) => next(createError(httpStatus.NOT_FOUND, `${req.url} not found`)));

/*  Error middleware  */
app.use(errorMiddleware);

/*  Server error handlers */
process.on('uncaughtException', (e) => logger.error(e));
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
process.on('unhandledRejection', (e: any) => logger.error(e ? e.stack : e));

app.listen(port, () => logger.info(`Server listening on port ${port}...`));
