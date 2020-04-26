import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

const authMiddleware: RequestHandler = (req, res, next) => {
  if (!req.session!.userId) {
    next(createError(httpStatus.UNAUTHORIZED, 'You must be logged in'));
  } else {
    next();
  }
};

export default authMiddleware;
