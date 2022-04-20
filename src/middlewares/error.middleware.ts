import type { ErrorRequestHandler } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { ApiError } from '@root/app.errors';
import { Ro } from '@root/app.types';
import logger from '@services/logger';

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
  const ro: Ro = {};
  let statusCode: StatusCodes;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    ro.error = {
      statusCode,
      message: err.message,
    };
    logger.error(err.message);
  } else {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    ro.error = {
      statusCode,
      message: getReasonPhrase(statusCode),
    };
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res
    .status(statusCode)
    .send(ro);
};

export default errorMiddleware;
