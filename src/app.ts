import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

/*  This import is only used for class-transformer side effects */
import 'reflect-metadata';

import router from './routes';
import { config } from './appConfig';
import session from './appSession';
import requestLogger from './middlewares/requestLogger';
import errorMiddleware from './middlewares/errorMiddleware';
import notFoundMiddleware from './middlewares/notFoundMiddleware';
import meMiddleware from './middlewares/meMiddleware';

/*  Express server  */
const app = express();

/*  Express session */
app.use(session);

/*  Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors({
  origin: config.whitelist,
}));
app.use(meMiddleware);
app.use(requestLogger);

/*  Proxy rules */
app.set('trust proxy', true);

/*  Routes  */
app.use(router);

/*  404 middleware  */
app.use(notFoundMiddleware);

/*  Error middleware  */
app.use(errorMiddleware);

export default app;
