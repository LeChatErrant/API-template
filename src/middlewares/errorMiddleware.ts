import type { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status-codes';

import logger from '../appLogger';
import { Ro } from '../appRo';
import { ApiError } from '../appErrors';

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
  if (!(err instanceof ApiError)) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const statusCode = err.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR;
  const ro: Ro = {
    error: {
      statusCode,
      message: err.message,
    },
  };
  res
    .status(statusCode)
    .send(ro);
};

export default errorMiddleware;
