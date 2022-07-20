/*  This import is used to resolve path aliases, since ts configuration is not enough for the built JS */
import './customImports';

/*  This import is only used for class-transformer side effects */
import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';

import corsMiddleware from '@middlewares/cors.middleware';
import errorMiddleware from '@middlewares/error.middleware';
import meMiddleware from '@middlewares/me.middleware';
import notFoundMiddleware from '@middlewares/notFound.middleware';
import requestLoggerMiddleware from '@middlewares/requestLogger.middleware';
import router from '@root/app.routes';
import session from '@root/app.session';

/*  Express server  */
const app = express();

/*  Express session */
app.use(session);

/*  Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(helmet());
app.use(meMiddleware);
app.use(requestLoggerMiddleware);

/*  Proxy rules */
app.set('trust proxy', true);

/*  Routes  */
app.use(router);

/*  404 middleware  */
app.use(notFoundMiddleware);

/*  Error middleware  */
app.use(errorMiddleware);

export default app;
