import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
function validationMiddleware(type: any): RequestHandler {
  return async (req, res, next) => {
    const errors = await validate(plainToClass(type, req.body));
    if (errors.length !== 0) {
      const message = errors.join('');
      next(createError(httpStatus.BAD_REQUEST, message));
    } else {
      next();
    }
  };
}

export default validationMiddleware;
