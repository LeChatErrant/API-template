import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

const authMiddleware: RequestHandler = (req, res, next) => {
  if (req.session!.userId) {
    next();
  } else {
    next(createError(httpStatus.UNAUTHORIZED, 'You must be logged in'));
  }
};

export default authMiddleware;
