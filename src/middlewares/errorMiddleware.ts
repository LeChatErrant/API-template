import createError from 'http-errors';
import type { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status-codes';

import logger from '../appLogger';
import { ErrorRo } from '../appRo';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ((err, req, res, _) => {
  logger.error(err.message.trimEnd());
  // If the error is not an HTTP error, the whole object is printed through console.error
  if (!createError.isHttpError(err)) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const status = err.status ?? httpStatus.INTERNAL_SERVER_ERROR;
  res
    .status(status)
    .send(ErrorRo(status, err.message));
}) as ErrorRequestHandler;
