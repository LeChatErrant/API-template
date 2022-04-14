import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '@root/app.errors';

/**
 * Middleware always throwing a 404 error
 * Need to be injected into express middlewares AFTER the router,
 * so as every requests not handled by the router are trapped here
 *
 * @throws 404 - Not found
 */
const notFoundMiddleware: RequestHandler = (req, res, next) => next(new ApiError(StatusCodes.NOT_FOUND, `${req.url} not found`));

export default notFoundMiddleware;
