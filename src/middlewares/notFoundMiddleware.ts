import type { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

/**
 * Middleware always throwing a 404 error
 * Need to be injected into express middlewares AFTER the router,
 * so as every requests not handled by the router are trapped here
 *
 * @throws 404 - Not found
 */
const notFoundMiddleware: RequestHandler = (req, res, next) => next(createError(httpStatus.NOT_FOUND, `${req.url} not found`));

export default notFoundMiddleware;
