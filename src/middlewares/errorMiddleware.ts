import type { ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import httpStatus from 'http-status-codes';

import logger from '../appLogger';
import { ErrorRo } from '../appRo';

/**
 * Error middleware
 * Every error thrown in a route ends up here to be sent to the user
 * They are formatted into a generic RO, to have uniform error replies
 *
 * Not wanted errors (for example, a crash in the route) are
 * converted into a 500 - Internal server errors
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, req, res, _) => {
  logger.error(err.message);
  // If the error is not an HTTP error, the whole object is printed through console.error
  if (!createError.isHttpError(err)) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const status = err.status ?? httpStatus.INTERNAL_SERVER_ERROR;
  res
    .status(status)
    .send(ErrorRo(status, err.message));
};

export default errorMiddleware;
